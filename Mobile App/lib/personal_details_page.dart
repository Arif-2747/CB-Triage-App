import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:myapp/app_header.dart';
import 'package:myapp/medical_history_page.dart';

// Registration Page 2 - Personal Details

class PersonalDetailsPage extends StatefulWidget {
  final String name;
  final String email;
  final String password;

  const PersonalDetailsPage({
    super.key,
    required this.name,
    required this.email,
    required this.password,
  });

  @override
  State<PersonalDetailsPage> createState() => _PersonalDetailsPageState();
}

class _PersonalDetailsPageState extends State<PersonalDetailsPage> {
  final _formKey = GlobalKey<FormState>();
  final _ageController = TextEditingController();
  String? _selectedGender;
  String? _selectedBloodGroup;
  bool? _hasInsurance;
  final _insuranceProviderController = TextEditingController();

  @override
  void dispose() {
    _ageController.dispose();
    _insuranceProviderController.dispose();
    super.dispose();
  }

  void _goToNextStep() {
    if (_formKey.currentState!.validate()) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => MedicalHistoryPage(
            name: widget.name,
            email: widget.email,
            password: widget.password,
            age: _ageController.text.trim(),
            gender: _selectedGender!,
            bloodGroup: _selectedBloodGroup!,
            hasInsurance: _hasInsurance ?? false,
            insuranceProvider: _insuranceProviderController.text.trim(),
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
                                'Personal Details (Step 2/3)',
                                style: TextStyle(
                                  fontSize: screenWidth * 0.06,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black87,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              SizedBox(height: screenHeight * 0.03),
                              const Text('Age', style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold)),
                              SizedBox(height: screenHeight * 0.01),
                              TextFormField(
                                controller: _ageController,
                                validator: (value) => value == null || value.isEmpty ? 'Please enter your age' : null,
                                keyboardType: TextInputType.number,
                                decoration: const InputDecoration(hintText: "Enter your age"),
                              ),
                              SizedBox(height: screenHeight * 0.02),
                              _buildGenderSelector(),
                              SizedBox(height: screenHeight * 0.02),
                              const Text('Blood Group', style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold)),
                              SizedBox(height: screenHeight * 0.01),
                              _buildBloodGroupSelector(),
                              SizedBox(height: screenHeight * 0.02),
                              const Text('Insurance', style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold)),
                              SizedBox(height: screenHeight * 0.01),
                              _buildInsuranceSelector(),
                              if (_hasInsurance == true) ...[
                                SizedBox(height: screenHeight * 0.02),
                                TextFormField(
                                  controller: _insuranceProviderController,
                                  validator: (value) => _hasInsurance == true && (value == null || value.isEmpty) ? 'Please enter your insurance provider' : null,
                                  decoration: const InputDecoration(hintText: "Insurance Provider Name"),
                                ),
                              ],
                              SizedBox(height: screenHeight * 0.03),
                              ElevatedButton(
                                onPressed: _goToNextStep,
                                child: const Text('Next: Medical History'),
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
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGenderSelector() {
    return FormField<String>(
      validator: (value) => _selectedGender == null ? 'Please select a gender' : null,
      builder: (state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Gender', style: TextStyle(color: Colors.black54, fontWeight: FontWeight.bold)),
            Row(
              children: [
                Radio<String>(
                  value: 'Male', groupValue: _selectedGender,
                  onChanged: (value) => setState(() { _selectedGender = value; state.didChange(value); }),
                ), const Text('Male'),
                Radio<String>(
                  value: 'Female', groupValue: _selectedGender,
                  onChanged: (value) => setState(() { _selectedGender = value; state.didChange(value); }),
                ), const Text('Female'),
                Radio<String>(
                  value: 'Other', groupValue: _selectedGender,
                  onChanged: (value) => setState(() { _selectedGender = value; state.didChange(value); }),
                ), const Text('Other'),
              ],
            ),
            if (state.hasError)
              Padding(
                padding: const EdgeInsets.only(left: 12.0),
                child: Text(state.errorText!, style: TextStyle(color: Theme.of(context).colorScheme.error, fontSize: 12)),
              ),
          ],
        );
      },
    );
  }

  Widget _buildBloodGroupSelector() {
    return DropdownButtonFormField<String>(
      hint: const Text('Select Blood Group'),
      value: _selectedBloodGroup,
      validator: (value) => value == null ? 'Please select a blood group' : null,
      onChanged: (value) => setState(() => _selectedBloodGroup = value),
      items: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
          .map((group) => DropdownMenuItem(value: group, child: Text(group)))
          .toList(),
    );
  }

  Widget _buildInsuranceSelector() {
    return DropdownButtonFormField<bool?>(
      hint: const Text('Select'),
      value: _hasInsurance,
      onChanged: (value) => setState(() => _hasInsurance = value),
      items: const [
        DropdownMenuItem(value: true, child: Text('Yes')),
        DropdownMenuItem(value: false, child: Text('No')),
      ],
    );
  }
}
