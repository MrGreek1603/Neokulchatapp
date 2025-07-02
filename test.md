# Neokul ChatForum Test Cases

## 1. Authentication and User Management

### 1.1 Signup Functionality
TC01: Verify Signup Page Loads
- Testing Type: Functional
- Item Being Tested: Signup Page
- Sample Input: Navigate to /signup
- Expected Output: Signup page loads with name, email, password, and confirm password fields
- Actual Output: Signup page loaded with all required fields in 2 seconds
- Remarks: Ensure page loads without errors and all fields are properly rendered

TC02: Verify Signup with Valid Details
- Testing Type: Functional
- Item Being Tested: Signup Form
- Sample Input: Name: "Test User", Email: "test@example.com", Password: "Test123!", Confirm Password: "Test123!"
- Expected Output: Success message, redirect to app dashboard
- Actual Output: Success message "Account created successfully!" displayed, redirected to /app
- Remarks: Verify all fields are properly validated

TC03: Verify Signup with Invalid Email Format
- Testing Type: Functional
- Item Being Tested: Signup Form
- Sample Input: Name: "Test User", Email: "invalid-email", Password: "Test123!", Confirm Password: "Test123!"
- Expected Output: Error message for invalid email format
- Actual Output: Error message "Invalid email address" displayed
- Remarks: Email validation working correctly

TC04: Verify Signup with Password Mismatch
- Testing Type: Functional
- Item Being Tested: Signup Form
- Sample Input: Name: "Test User", Email: "test@example.com", Password: "Test123!", Confirm Password: "Test456!"
- Expected Output: Error message for password mismatch
- Actual Output: Error message "Passwords do not match" displayed
- Remarks: Password confirmation validation working

TC05: Verify Signup with Short Password
- Testing Type: Functional
- Item Being Tested: Signup Form
- Sample Input: Name: "Test User", Email: "test@example.com", Password: "Test1", Confirm Password: "Test1"
- Expected Output: Error message for password length
- Actual Output: Error message "Password must be at least 8 characters" displayed
- Remarks: Password length validation working

### 1.2 Login Functionality
TC06: Verify Login Page Loads
- Testing Type: Functional
- Item Being Tested: Login Page
- Sample Input: Navigate to /login
- Expected Output: Login page loads with email and password fields
- Actual Output: Login page loaded with all required fields in 2 seconds
- Remarks: Ensure page loads without errors

TC07: Verify Login with Valid Credentials
- Testing Type: Functional
- Item Being Tested: Login Form
- Sample Input: Email: "test@example.com", Password: "Test123!"
- Expected Output: Success message, redirect to app dashboard
- Actual Output: Redirected to /app dashboard
- Remarks: Successful login flow working

TC08: Verify Login with Invalid Credentials
- Testing Type: Functional
- Item Being Tested: Login Form
- Sample Input: Email: "test@example.com", Password: "WrongPass123!"
- Expected Output: Error message for invalid credentials
- Actual Output: Error message "Failed to sign in" displayed
- Remarks: Invalid credential handling working

TC09: Verify Login with Invalid Email Format
- Testing Type: Functional
- Item Being Tested: Login Form
- Sample Input: Email: "invalid-email", Password: "Test123!"
- Expected Output: Error message for invalid email format
- Actual Output: Error message "Invalid email address" displayed
- Remarks: Email validation working

TC10: Verify Login with Empty Fields
- Testing Type: Functional
- Item Being Tested: Login Form
- Sample Input: Email: "", Password: ""
- Expected Output: Error messages for required fields
- Actual Output: Error messages "Email is required" and "Password is required" displayed
- Remarks: Required field validation working

### 1.3 Profile Management
TC11: Verify Profile Page Loads
- Testing Type: Functional
- Item Being Tested: Profile Page
- Sample Input: Navigate to /app/profile
- Expected Output: Profile page loads with user details
- Actual Output: Profile page loaded with user information in 2 seconds
- Remarks: Ensure page loads without errors

TC12: Verify Profile Update with Valid Data
- Testing Type: Functional
- Item Being Tested: Profile Update
- Sample Input: Update name to "Updated Name"
- Expected Output: Success message, profile updated
- Actual Output: Success message "Profile updated successfully!" displayed
- Remarks: Profile update working correctly

TC13: Verify Profile Picture Upload
- Testing Type: Functional
- Item Being Tested: Profile Picture
- Sample Input: Upload new profile picture
- Expected Output: Success message, picture updated
- Actual Output: Success message "Profile updated successfully!" displayed
- Remarks: Image upload and update working

TC14: Verify Profile Picture Preview
- Testing Type: Functional
- Item Being Tested: Profile Picture Preview
- Sample Input: Select new profile picture
- Expected Output: Preview of selected image
- Actual Output: Image preview displayed before upload
- Remarks: Preview functionality working

TC15: Verify Profile Update with Empty Name
- Testing Type: Functional
- Item Being Tested: Profile Update
- Sample Input: Update name to empty string
- Expected Output: Error message
- Actual Output: Error message "Failed to update profile" displayed
- Remarks: Empty name validation working

## 2. Chat and Messaging

### 2.1 Friend Management
TC16: Verify Friend Search
- Testing Type: Functional
- Item Being Tested: Friend Search
- Sample Input: Search for user "John"
- Expected Output: List of matching users
- Actual Output: Search results displayed with matching users
- Remarks: Search functionality working

TC17: Verify Friend Request Send
- Testing Type: Functional
- Item Being Tested: Friend Request
- Sample Input: Send friend request to user
- Expected Output: Success message
- Actual Output: Friend request sent successfully
- Remarks: Friend request system working

TC18: Verify Friend Request Accept
- Testing Type: Functional
- Item Being Tested: Friend Request
- Sample Input: Accept friend request
- Expected Output: Success message, friend added
- Actual Output: Friend request accepted, user added to friends list
- Remarks: Friend request acceptance working

TC19: Verify Friend Request Reject
- Testing Type: Functional
- Item Being Tested: Friend Request
- Sample Input: Reject friend request
- Expected Output: Request removed
- Actual Output: Friend request removed from pending requests
- Remarks: Friend request rejection working

TC20: Verify Friend List Display
- Testing Type: Functional
- Item Being Tested: Friend List
- Sample Input: View friends list
- Expected Output: List of all friends
- Actual Output: Friends list displayed with correct information
- Remarks: Friend list display working

### 2.2 Group Management
TC21: Verify Group Creation
- Testing Type: Functional
- Item Being Tested: Group Creation
- Sample Input: Create new group "Test Group"
- Expected Output: Success message, group created
- Actual Output: Group created successfully
- Remarks: Group creation working

TC22: Verify Group Visibility Settings
- Testing Type: Functional
- Item Being Tested: Group Settings
- Sample Input: Change group visibility to private
- Expected Output: Success message, visibility updated
- Actual Output: Group visibility updated successfully
- Remarks: Group settings working

TC23: Verify Group Member Addition
- Testing Type: Functional
- Item Being Tested: Group Management
- Sample Input: Add member to group
- Expected Output: Success message, member added
- Actual Output: Member added to group successfully
- Remarks: Group member management working

TC24: Verify Group Chat Access
- Testing Type: Functional
- Item Being Tested: Group Chat
- Sample Input: Access group chat
- Expected Output: Group chat interface
- Actual Output: Group chat loaded with message history
- Remarks: Group chat access working

TC25: Verify Group Member Removal
- Testing Type: Functional
- Item Being Tested: Group Management
- Sample Input: Remove member from group
- Expected Output: Success message, member removed
- Actual Output: Member removed from group successfully
- Remarks: Group member removal working 