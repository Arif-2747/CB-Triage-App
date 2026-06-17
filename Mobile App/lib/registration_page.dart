import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:myapp/app_header.dart';
import 'package:myapp/personal_details_page.dart';

// Registration Page 1 - Create Account

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({super.key});

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _goToNextStep() {
    if (_formKey.currentState!.validate()) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => PersonalDetailsPage(
            name: _nameController.text.trim(),
            email: _emailController.text.trim(),
            password: _passwordController.text,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF00D2FF),
              Color(0xFF3A7BD5),
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: EdgeInsets.symmetric(vertical: screenHeight * 0.02, horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const AppHeader(),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(25),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                      child: Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white.withAlpha(100),
                          borderRadius: BorderRadius.circular(25),
                          border: Border.all(color: Colors.white.withAlpha(150), width: 1.5),
                        ),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Text(
                                'Create Account (Step 1/3)',
                                style: TextStyle(
                                  fontSize: screenWidth * 0.06,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              SizedBox(height: screenHeight * 0.03),
                              TextFormField(
                                controller: _nameController,
                                decoration: const InputDecoration(labelText: 'Full Name'),
                                validator: (value) => value == null || value.isEmpty ? 'Please enter your name' : null,
                              ),
                              SizedBox(height: screenHeight * 0.02),
                              TextFormField(
                                controller: _emailController,
                                decoration: const InputDecoration(labelText: 'Email Address'),
                                validator: (value) {
                                  if (value == null || value.isEmpty) return 'Please enter your email';
                                  if (!RegExp(r'\S+@\S+\.\S+').hasMatch(value)) return 'Please enter a valid email address';
                                  return null;
                                },
                              ),
                              SizedBox(height: screenHeight * 0.02),
                              TextFormField(
                                controller: _passwordController,
                                decoration: const InputDecoration(labelText: 'Password (min. 6 characters)'),
                                obscureText: true,
                                validator: (value) {
                                  if (value == null || value.isEmpty) return 'Please enter a password';
                                  if (value.length < 6) return 'Password must be at least 6 characters long';
                                  return null;
                                },
                              ),
                              SizedBox(height: screenHeight * 0.02),
                              TextFormField(
                                controller: _confirmPasswordController,
                                decoration: const InputDecoration(labelText: 'Confirm Password'),
                                obscureText: true,
                                validator: (value) {
                                  if (value != _passwordController.text) return 'Passwords do not match';
                                  return null;
                                },
                              ),
                              SizedBox(height: screenHeight * 0.03),
                              ElevatedButton(
                                onPressed: _goToNextStep,
                                child: const Text('Next: Personal Details'),
                              ),
                              TextButton(
                                onPressed: () => Navigator.of(context).pop(),
                                child: const Text('Already have an account? Log In'),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
