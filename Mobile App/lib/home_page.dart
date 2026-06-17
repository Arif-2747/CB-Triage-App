import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:myapp/appointment_page.dart';
import 'package:myapp/edit_profile_page.dart';
import 'package:myapp/symptom_history_page.dart';
import 'package:myapp/tests_page.dart';

//Home Page

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  static final List<Widget> _widgetOptions = <Widget>[
    const HealthDashboard(),
    const AppointmentsPage(),
    const TestsPage(),
    const ProfilePage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Future<void> _showSymptomLogDialog() async {
    final symptomController = TextEditingController();
    double severity = 2.0; // Default to 'Moderate'
    final severityLabels = ['Mild', 'Moderate', 'Severe'];

    return showDialog<void>(
        context: context,
        builder: (BuildContext context) {
          return StatefulBuilder(builder: (context, setState) {
            return AlertDialog(
              backgroundColor: Colors.white.withAlpha(230),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Text("Log Today's Symptoms", style: TextStyle(fontWeight: FontWeight.bold)),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextFormField(
                      controller: symptomController,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        labelText: 'How are you feeling?',
                        alignLabelWithHint: true,
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text('Severity: ${severityLabels[severity.round() - 1]}', style: const TextStyle(fontWeight: FontWeight.w500)),
                    Slider(
                      value: severity,
                      min: 1,
                      max: 3,
                      divisions: 2,
                      label: severityLabels[severity.round() - 1],
                      onChanged: (double value) {
                        setState(() {
                          severity = value;
                        });
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(child: const Text('Cancel'), onPressed: () => Navigator.of(context).pop()),
                ElevatedButton(child: const Text('Save Log'), onPressed: () {
                  // TODO: Implement save logic
                  Navigator.of(context).pop();
                }),
              ],
            );
          });
        });
  }

  Future<void> _showAddAppointmentDialog() async {
    final formKey = GlobalKey<FormState>();
    final doctorController = TextEditingController();
    final specialistController = TextEditingController();
    final hospitalController = TextEditingController();
    final locationController = TextEditingController();
    final reasonController = TextEditingController();
    DateTime? selectedDate;
    TimeOfDay? selectedTime;

    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              backgroundColor: Colors.white.withAlpha(230),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Text('Add New Appointment', style: TextStyle(fontWeight: FontWeight.bold)),
              content: SingleChildScrollView(
                child: Form(
                  key: formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      TextFormField(controller: doctorController, decoration: const InputDecoration(labelText: "Doctor's Name")),
                      TextFormField(controller: specialistController, decoration: const InputDecoration(labelText: "Specialist")),
                      TextFormField(controller: hospitalController, decoration: const InputDecoration(labelText: "Hospital/Clinic Name")),
                      TextFormField(controller: locationController, decoration: const InputDecoration(labelText: "Location")),
                      TextFormField(controller: reasonController, decoration: const InputDecoration(labelText: "Reason for Appointment")),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () async {
                                final DateTime? picked = await showDatePicker(context: context, initialDate: selectedDate ?? DateTime.now(), firstDate: DateTime.now(), lastDate: DateTime(2101));
                                if (picked != null) setState(() => selectedDate = picked);
                              },
                              child: Text(selectedDate == null ? 'Select Date' : DateFormat.yMMMd().format(selectedDate!)),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () async {
                                final TimeOfDay? picked = await showTimePicker(context: context, initialTime: selectedTime ?? TimeOfDay.now());
                                if (picked != null) setState(() => selectedTime = picked);
                              },
                              child: Text(selectedTime == null ? 'Select Time' : selectedTime!.format(context)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              actions: <Widget>[
                TextButton(child: const Text('Cancel'), onPressed: () => Navigator.of(context).pop()),
                ElevatedButton(child: const Text('Add Appointment'), onPressed: () { if (formKey.currentState!.validate()) Navigator.of(context).pop(); }),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _showAddTestEntryDialog() async {
    String? entryType;
    String? upcomingType; // 'test' or 'surgery'

    Widget buildInitialSelection(StateSetter setState) {
      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () => setState(() => entryType = 'upcoming'), child: const Text('Add Upcoming Test/Surgery'))),
          const SizedBox(height: 10),
          SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () => setState(() => entryType = 'result'), child: const Text('Upload Lab Result'))),
          const SizedBox(height: 10),
          SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () => setState(() => entryType = 'past_surgery'), child: const Text('Add Past Surgery'))),
        ],
      );
    }

    Widget buildForm(StateSetter setState) {
      final nameController = TextEditingController();
      final dateController = TextEditingController();

      return Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (entryType == 'upcoming') ...[
            DropdownButtonFormField<String>(
              value: upcomingType,
              hint: const Text('Select Type'),
              onChanged: (String? newValue) {
                setState(() {
                  upcomingType = newValue;
                });
              },
              items: <String>['Upcoming Test', 'Upcoming Surgery'].map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
            if (upcomingType != null) ...[
              const SizedBox(height: 10),
              TextFormField(controller: nameController, decoration: InputDecoration(labelText: upcomingType == 'Upcoming Test' ? 'Test Name' : 'Surgery Name')),
              TextFormField(controller: dateController, decoration: const InputDecoration(labelText: 'Date & Time')),
            ],
          ],
          if (entryType == 'result') ...[
            TextFormField(controller: nameController, decoration: const InputDecoration(labelText: 'Test Name')),
            TextFormField(controller: dateController, decoration: const InputDecoration(labelText: 'Date of Result')),
            const SizedBox(height: 10),
            ElevatedButton.icon(onPressed: () {/* TODO */}, icon: const Icon(Icons.upload_file), label: const Text("Upload Report")),
          ],
          if (entryType == 'past_surgery') ...[
            TextFormField(controller: nameController, decoration: const InputDecoration(labelText: 'Surgery Name')),
            TextFormField(controller: dateController, decoration: const InputDecoration(labelText: 'Date of Surgery')),
          ],
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton(onPressed: () => setState(() => entryType = null), child: const Text('Back')),
              ElevatedButton(onPressed: () => Navigator.of(context).pop(), child: const Text('Save Entry')),
            ],
          )
        ],
      );
    }

    return showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(builder: (context, setState) {
          return AlertDialog(
            backgroundColor: Colors.white.withAlpha(242),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            title: Text(entryType == null ? 'Select Entry Type' : 'Enter Details', style: const TextStyle(fontWeight: FontWeight.bold)),
            content: entryType == null ? buildInitialSelection(setState) : buildForm(setState),
            actions: entryType == null ? [TextButton(child: const Text('Cancel'), onPressed: () => Navigator.of(context).pop())] : [],
          );
        });
      },
    );
  }

  Widget? _getFabForIndex() {
    switch (_selectedIndex) {
      case 0:
        return FloatingActionButton.extended(
          onPressed: _showSymptomLogDialog,
          label: const Text("Log Today's Symptoms"),
          icon: const Icon(Icons.add),
          backgroundColor: const Color(0xFFD7BEE7),
          foregroundColor: Colors.black87,
        );
      case 1:
        return FloatingActionButton.extended(
          onPressed: _showAddAppointmentDialog,
          label: const Text('Add New Appointment'),
          icon: const Icon(Icons.add),
          backgroundColor: const Color(0xFFD7BEE7),
          foregroundColor: Colors.black87,
        );
      case 2:
        return FloatingActionButton.extended(
          onPressed: _showAddTestEntryDialog,
          label: const Text('Add New Entry'),
          icon: const Icon(Icons.add),
          backgroundColor: const Color(0xFFD7BEE7),
          foregroundColor: Colors.black87,
        );
      default:
        return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      floatingActionButton: _getFabForIndex(),
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
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.only(left: 24, right: 24, bottom: 24),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(50.0),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              decoration: BoxDecoration(
                  color: Colors.black.withAlpha(50),
                  border: Border.all(color: Colors.white.withAlpha(30))
              ),
              child: BottomNavigationBar(
                items: [
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.home_outlined, size: 27.5),
                    activeIcon: Icon(Icons.home, size: 27.5, shadows: [Shadow(color: Colors.white, blurRadius: 15)]),
                    label: 'Home',
                  ),
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.calendar_today_outlined, size: 22),
                    activeIcon: Icon(Icons.calendar_today, size: 22, shadows: [Shadow(color: Colors.white, blurRadius: 15)]),
                    label: 'Appointments',
                  ),
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.biotech_outlined, size: 30),
                    activeIcon: Icon(Icons.biotech, size: 30, shadows: [Shadow(color: Colors.white, blurRadius: 15)]),
                    label: 'Tests',
                  ),
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.person_outline, size: 30),
                    activeIcon: Icon(Icons.person, size: 30, shadows: [Shadow(color: Colors.white, blurRadius: 15)]),
                    label: 'Profile',
                  ),
                ],
                currentIndex: _selectedIndex,
                selectedItemColor: Colors.white,
                unselectedItemColor: Colors.white70,
                onTap: _onItemTapped,
                backgroundColor: Colors.transparent,
                type: BottomNavigationBarType.fixed,
                elevation: 0,
                showSelectedLabels: false,
                showUnselectedLabels: false,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class HealthDashboard extends StatelessWidget {
  const HealthDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Welcome back, User!',
              style: TextStyle(color: Colors.white, fontSize: screenWidth * 0.07, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: screenHeight * 0.03),
            _buildHealthVitalsCard(screenWidth),
            SizedBox(height: screenHeight * 0.03),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Today's Medications",
                  style: TextStyle(color: Colors.white, fontSize: screenWidth * 0.05, fontWeight: FontWeight.bold),
                ),
                TextButton(
                  onPressed: () {
                    // TODO: Navigate to a full medication history page
                  },
                  child: const Text('View All', style: TextStyle(color: Colors.white70)),
                )
              ],
            ),
            SizedBox(height: screenHeight * 0.02),
            _buildMedicationList(),
            const SizedBox(height: 20),
            Center(
              child: TextButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const SymptomHistoryPage()),
                  );
                },
                icon: const Icon(Icons.history, color: Colors.white70),
                label: const Text('View Full Symptom History', style: TextStyle(color: Colors.white70)),
                style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(color: Colors.white.withAlpha(100))
                    )
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHealthVitalsCard(double screenWidth) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(25),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withAlpha(100),
            borderRadius: BorderRadius.circular(25),
            border: Border.all(color: Colors.white.withAlpha(150), width: 1.5),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildVital("Blood Group", "O+"),
              _buildVital("Allergies", "None"),
              _buildVital("Age", "28"),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildVital(String title, String value) {
    return Column(
      children: [
        Text(title, style: TextStyle(color: Colors.white.withAlpha(200), fontSize: 14)),
        const SizedBox(height: 5),
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildMedicationList() {
    final medications = [
      {"name": "Metformin", "time": "8:00 AM"},
      {"name": "Lisinopril", "time": "8:00 AM"},
      {"name": "Vitamin D", "time": "1:00 PM"},
    ];

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: medications.length,
      itemBuilder: (context, index) {
        return Card(
          color: Colors.white.withAlpha(220),
          margin: const EdgeInsets.only(bottom: 10),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          child: ListTile(
            leading: const Icon(Icons.medication_outlined, color: Color(0xFF0095D1)),
            title: Text(medications[index]['name']!, style: const TextStyle(fontWeight: FontWeight.bold)),
            trailing: Text(medications[index]['time']!),
          ),
        );
      },
    );
  }
}

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'My Profile',
              style: TextStyle(
                color: Colors.white,
                fontSize: screenWidth * 0.07,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: screenHeight * 0.03),
            ClipRRect(
              borderRadius: BorderRadius.circular(25),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withAlpha(100),
                    borderRadius: BorderRadius.circular(25),
                    border: Border.all(color: Colors.white.withAlpha(150), width: 1.5),
                  ),
                  child: Column(
                    children: [
                      _buildProfileInfoRow(Icons.person_outline, "Full Name", "User Name"),
                      _buildProfileInfoRow(Icons.email_outlined, "Email", "user.name@email.com"),
                      _buildProfileInfoRow(Icons.cake_outlined, "Age", "28"),
                      _buildProfileInfoRow(Icons.bloodtype_outlined, "Blood Group", "O+"),
                      _buildProfileInfoRow(Icons.warning_amber_outlined, "Allergies", "None"),
                      _buildProfileInfoRow(Icons.shield_outlined, "Insurance", "United Health"),
                    ],
                  ),
                ),
              ),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const EditProfilePage()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                padding: EdgeInsets.symmetric(vertical: screenHeight * 0.02),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.edit_outlined, color: Colors.blue.shade800),
                  SizedBox(width: screenWidth * 0.03),
                  Text(
                    "Edit Profile",
                    style: TextStyle(
                      color: Colors.blue.shade800,
                      fontWeight: FontWeight.bold,
                      fontSize: screenWidth * 0.04,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: screenHeight * 0.01),
            Center(
              child: TextButton(
                onPressed: () {
                  // TODO: Implement Logout Logic
                },
                child: const Text(
                  'Logout',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileInfoRow(IconData icon, String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Row(
        children: [
          Icon(icon, color: Colors.white.withAlpha(200), size: 20),
          const SizedBox(width: 15),
          Text(title, style: TextStyle(color: Colors.white.withAlpha(200), fontSize: 16)),
          const Spacer(),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
