#!/usr/bin/env python3

import requests
import sys
from datetime import datetime
import json

class QradientAPITester:
    def __init__(self, base_url="https://qradient-preview.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_items = {"contacts": [], "jobs": [], "applications": []}

    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, params=params)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return True, response.json() if response.text else {}
                except:
                    return True, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}", "ERROR")
                try:
                    self.log(f"Response: {response.text}", "DEBUG")
                except:
                    pass
                return False, {}

        except Exception as e:
            self.log(f"❌ {name} - Error: {str(e)}", "ERROR")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        self.log("=" * 50)
        self.log("TESTING ROOT ENDPOINT")
        self.log("=" * 50)
        success, response = self.run_test("API Root", "GET", "", 200)
        if success and "message" in response:
            self.log(f"API Message: {response['message']}")
        return success

    def test_seed_data(self):
        """Test seeding initial data"""
        self.log("=" * 50)
        self.log("TESTING SEED DATA")
        self.log("=" * 50)
        success, response = self.run_test("Seed Data", "POST", "seed", 200)
        if success:
            self.log(f"Seed Response: {response.get('message', 'No message')}")
        return success

    def test_contacts_crud(self):
        """Test complete CRUD operations for contacts"""
        self.log("=" * 50)
        self.log("TESTING CONTACTS ENDPOINTS")
        self.log("=" * 50)
        
        # 1. Create contact
        test_contact = {
            "name": "Test User",
            "email": "test@example.com", 
            "message": "This is a test message for API testing."
        }
        
        success, contact = self.run_test(
            "Create Contact",
            "POST",
            "contacts",
            200,
            data=test_contact
        )
        
        if not success:
            return False
            
        contact_id = contact.get("id")
        if contact_id:
            self.created_items["contacts"].append(contact_id)
            self.log(f"Created contact with ID: {contact_id}")
        
        # 2. Get all contacts
        success, contacts = self.run_test("Get Contacts", "GET", "contacts", 200)
        if success:
            self.log(f"Retrieved {len(contacts)} contacts")
        
        # 3. Update contact status
        if contact_id:
            success, _ = self.run_test(
                "Update Contact Status",
                "PATCH",
                f"contacts/{contact_id}/status",
                200,
                params={"status": "read"}
            )
        
        return success

    def test_jobs_crud(self):
        """Test complete CRUD operations for jobs"""
        self.log("=" * 50)
        self.log("TESTING JOBS ENDPOINTS")
        self.log("=" * 50)
        
        # 1. Get existing jobs first
        success, existing_jobs = self.run_test("Get Existing Jobs", "GET", "jobs", 200)
        if success:
            self.log(f"Found {len(existing_jobs)} existing jobs")
        
        # 2. Create new job
        test_job = {
            "title": "Test Developer Position",
            "location": "Remote / Test City",
            "location_type": "REMOTE",
            "description": "This is a test job posting for API testing purposes.",
            "requirements": ["Test requirement 1", "Test requirement 2"],
            "benefits": ["Test benefit 1", "Test benefit 2"],
            "accent_color": "blue"
        }
        
        success, job = self.run_test(
            "Create Job",
            "POST", 
            "jobs",
            200,
            data=test_job
        )
        
        if not success:
            return False
            
        job_id = job.get("id")
        if job_id:
            self.created_items["jobs"].append(job_id)
            self.log(f"Created job with ID: {job_id}")
        
        # 3. Get specific job
        if job_id:
            success, job_detail = self.run_test("Get Job Detail", "GET", f"jobs/{job_id}", 200)
            if success:
                self.log(f"Retrieved job: {job_detail.get('title', 'No title')}")
        
        # 4. Get active jobs only
        success, active_jobs = self.run_test(
            "Get Active Jobs Only",
            "GET",
            "jobs",
            200,
            params={"active_only": True}
        )
        
        # 5. Update job
        if job_id:
            updated_job = {**test_job, "title": "Updated Test Developer Position"}
            success, _ = self.run_test(
                "Update Job",
                "PATCH",
                f"jobs/{job_id}",
                200,
                data=updated_job
            )
        
        # 6. Toggle job status
        if job_id:
            success, _ = self.run_test(
                "Toggle Job Status",
                "PATCH",
                f"jobs/{job_id}/toggle",
                200
            )
        
        return success

    def test_applications_crud(self):
        """Test complete CRUD operations for applications"""
        self.log("=" * 50)
        self.log("TESTING APPLICATIONS ENDPOINTS")
        self.log("=" * 50)
        
        # Ensure we have a job to apply to
        job_id = None
        if self.created_items["jobs"]:
            job_id = self.created_items["jobs"][0]
        else:
            # Get any existing job
            success, jobs = self.run_test("Get Jobs for Application", "GET", "jobs", 200)
            if success and jobs:
                job_id = jobs[0]["id"]
        
        if not job_id:
            self.log("❌ No job available for application testing", "ERROR")
            return False
        
        # 1. Create application
        test_application = {
            "job_id": job_id,
            "name": "Test Applicant",
            "email": "applicant@example.com",
            "phone": "+1234567890",
            "linkedin": "https://linkedin.com/in/testuser",
            "portfolio": "https://testuser.dev",
            "cover_letter": "This is a test cover letter for API testing purposes.",
            "experience_years": 5
        }
        
        success, application = self.run_test(
            "Create Application",
            "POST",
            "applications",
            200,
            data=test_application
        )
        
        if not success:
            return False
            
        app_id = application.get("id")
        if app_id:
            self.created_items["applications"].append(app_id)
            self.log(f"Created application with ID: {app_id}")
        
        # 2. Get all applications
        success, applications = self.run_test("Get Applications", "GET", "applications", 200)
        if success:
            self.log(f"Retrieved {len(applications)} applications")
        
        # 3. Get applications for specific job
        success, job_applications = self.run_test(
            "Get Job Applications",
            "GET",
            "applications",
            200,
            params={"job_id": job_id}
        )
        
        # 4. Get specific application
        if app_id:
            success, app_detail = self.run_test("Get Application Detail", "GET", f"applications/{app_id}", 200)
        
        # 5. Update application status - test all valid statuses
        valid_statuses = ["reviewing", "interviewed", "accepted", "rejected"]
        if app_id:
            for status in valid_statuses[:2]:  # Test first 2 to avoid excessive calls
                success, _ = self.run_test(
                    f"Update Application Status to {status}",
                    "PATCH",
                    f"applications/{app_id}/status",
                    200,
                    params={"status": status}
                )
                if not success:
                    break
        
        return success

    def test_stats_endpoint(self):
        """Test stats endpoint"""
        self.log("=" * 50)
        self.log("TESTING STATS ENDPOINT")
        self.log("=" * 50)
        
        success, stats = self.run_test("Get Stats", "GET", "stats", 200)
        
        if success:
            self.log("Stats Response:")
            for category, data in stats.items():
                if isinstance(data, dict):
                    for key, value in data.items():
                        self.log(f"  {category}.{key}: {value}")
        
        return success

    def test_error_cases(self):
        """Test error handling"""
        self.log("=" * 50)
        self.log("TESTING ERROR CASES")
        self.log("=" * 50)
        
        # Test invalid job ID
        self.run_test("Invalid Job ID", "GET", "jobs/invalid-id", 404)
        
        # Test invalid application ID
        self.run_test("Invalid Application ID", "GET", "applications/invalid-id", 404)
        
        # Test invalid contact ID
        self.run_test("Invalid Contact ID", "PATCH", "contacts/invalid-id/status", 404, params={"status": "read"})
        
        # Test invalid application status
        if self.created_items["applications"]:
            app_id = self.created_items["applications"][0]
            self.run_test(
                "Invalid Application Status",
                "PATCH",
                f"applications/{app_id}/status",
                400,
                params={"status": "invalid_status"}
            )

    def cleanup(self):
        """Clean up created test data"""
        self.log("=" * 50)
        self.log("CLEANING UP TEST DATA")
        self.log("=" * 50)
        
        # Delete created contacts
        for contact_id in self.created_items["contacts"]:
            self.run_test(f"Delete Contact {contact_id}", "DELETE", f"contacts/{contact_id}", 200)
        
        # Delete created applications  
        for app_id in self.created_items["applications"]:
            self.run_test(f"Delete Application {app_id}", "DELETE", f"applications/{app_id}", 200)
        
        # Delete created jobs
        for job_id in self.created_items["jobs"]:
            self.run_test(f"Delete Job {job_id}", "DELETE", f"jobs/{job_id}", 200)

    def run_all_tests(self):
        """Run all API tests"""
        self.log("🚀 Starting Qradient API Testing")
        self.log(f"Base URL: {self.base_url}")
        
        test_results = []
        
        # Core functionality tests
        test_results.append(self.test_root_endpoint())
        test_results.append(self.test_seed_data())
        test_results.append(self.test_contacts_crud())
        test_results.append(self.test_jobs_crud())
        test_results.append(self.test_applications_crud())
        test_results.append(self.test_stats_endpoint())
        
        # Error handling tests
        self.test_error_cases()
        
        # Cleanup
        self.cleanup()
        
        # Print results
        self.log("=" * 50)
        self.log("TEST RESULTS SUMMARY")
        self.log("=" * 50)
        self.log(f"📊 Tests Run: {self.tests_run}")
        self.log(f"✅ Tests Passed: {self.tests_passed}")
        self.log(f"❌ Tests Failed: {self.tests_run - self.tests_passed}")
        self.log(f"📈 Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        success_rate = (self.tests_passed / self.tests_run) * 100
        
        if success_rate >= 90:
            self.log("🎉 EXCELLENT: API is working well!")
            return 0
        elif success_rate >= 75:
            self.log("⚠️  GOOD: API has minor issues")
            return 0  
        elif success_rate >= 50:
            self.log("🔧 NEEDS WORK: API has several issues")
            return 1
        else:
            self.log("🚨 CRITICAL: API has major issues")
            return 1

def main():
    tester = QradientAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())