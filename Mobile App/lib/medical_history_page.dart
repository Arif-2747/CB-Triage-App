import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:myapp/app_header.dart';
import 'package:myapp/home_page.dart';

// Registration Page 3 - Medical History

class MedicalHistoryPage extends StatefulWidget {
  final String name;
  final String email;
  final String password;
  final String age;
  final String gender;
  final String bloodGroup;
  final bool hasInsurance;
  final String? insuranceProvider;

  const MedicalHistoryPage({
    super.key,
    required this.name,
    required this.email,
    required this.password,
    required this.age,
    required this.gender,
    required this.bloodGroup,
    required this.hasInsurance,
    this.insuranceProvider,
  });

  @override
  State<MedicalHistoryPage> createState() => _MedicalHistoryPageState();
}

class _MedicalHistoryPageState extends State<MedicalHistoryPage> {
  final _allergiesController = TextEditingController();
  final _medicationsController = TextEditingController();
  final _historyController = TextEditingController();
  bool? _hasAllergies;

  void _submitRegistration() {
    // TODO: Phase 4 - Implement Firebase user creation and data saving logic here.

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const HomePage()),
          (Route<dynamic> route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    //final screenHeight = MediaQuery.of(context).size.height;
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
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
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
                          color: Colors.white.withAlpha(179),
                          borderRadius: BorderRadius.circular(25),
                          border: Border.all(color: Colors.white.withAlpha(102), width: 1.5),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              'Medical History (Step 3/3)',
                              style: TextStyle(
                                fontSize: screenWidth * 0.06,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 20),
                            _buildAllergySelector(),
                            if (_hasAllergies == true) ...[
                              const SizedBox(height: 16),
                              TextFormField(
                                controller: _allergiesController,
                                decoration: const InputDecoration(hintText: 'Please specify your allergies'),
                              ),
                            ],
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _medicationsController,
                              decoration: const InputDecoration(hintText: 'Current Medications (Optional)'),
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _historyController,
                              decoration: const InputDecoration(hintText: 'Describe any past surgeries or medical conditions (Optional)'),
                              maxLines: 3,
                            ),
                            const SizedBox(height: 24),
                            ElevatedButton(
                              onPressed: _submitRegistration,
                              child: const Text('Submit'),
                            ),
                            TextButton(
                              onPressed: () => Navigator.of(context).pop(),
                              child: const Text('Back'),
                            ),
                          ],
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

  Widget _buildAllergySelector() {
    return DropdownButtonFormField<bool?>(
      hint: const Text('Do you have any allergies?'),
      value: _hasAllergies,
      onChanged: (value) {
        setState(() {
          _hasAllergies = value;
        });
      },
      items: const [
        DropdownMenuItem(value: true, child: Text('Yes')),
        DropdownMenuItem(value: false, child: Text('No')),
      ],
    );
  }
}
