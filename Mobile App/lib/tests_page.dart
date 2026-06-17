import 'package:flutter/material.dart';

class TestsPage extends StatelessWidget {
  const TestsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    // Mock data
    final List<Map<String, String>> upcomingTests = [
      {"name": "MRI Scan", "date": "This Friday, 2:00 PM"},
      {"name": "Blood Test", "date": "Next Monday, 9:00 AM"},
    ];

    final List<Map<String, String>> labResults = [
      {"name": "Cholesterol Panel", "date": "May 15, 2024", "status": "View Results"},
      {"name": "Thyroid Function Test", "date": "April 22, 2024", "status": "View Results"},
    ];

    final List<Map<String, String>> pastSurgeries = [
      {"name": "Appendectomy", "date": "June 2021"},
      {"name": "Knee Arthroscopy", "date": "March 2019"},
    ];

    return SafeArea(
      child: Column(
        children: [
          AppBar(
            automaticallyImplyLeading: false,
            title: Text(
              'Tests & Surgeries',
              style: TextStyle(
                color: Colors.white,
                fontSize: screenWidth * 0.07,
                fontWeight: FontWeight.bold,
              ),
            ),
            backgroundColor: Colors.transparent,
            elevation: 0,
            centerTitle: true,
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionHeader(context, "Upcoming Tests & Surgeries"),
                  _buildUpcomingTestsList(upcomingTests),
                  const SizedBox(height: 20),
                  _buildSectionHeader(context, "Lab Test Results"),
                  _buildLabResultsList(labResults),
                  const SizedBox(height: 20),
                  _buildSectionHeader(context, "Past Surgeries History"),
                  _buildPastSurgeriesList(pastSurgeries),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(BuildContext context, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: Text(
        title,
        style: TextStyle(
          color: Colors.white,
          fontSize: MediaQuery.of(context).size.width * 0.05,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildUpcomingTestsList(List<Map<String, String>> items) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          color: Colors.white.withAlpha(220),
          margin: const EdgeInsets.only(bottom: 15),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            leading: const Icon(Icons.biotech_outlined, color: Color(0xFF0095D1), size: 40),
            title: Text(item['name']!, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(item['date']!),
          ),
        );
      },
    );
  }

  Widget _buildLabResultsList(List<Map<String, String>> items) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          color: Colors.white.withAlpha(220),
          margin: const EdgeInsets.only(bottom: 15),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            leading: const Icon(Icons.description_outlined, color: Color(0xFF0095D1), size: 40),
            title: Text(item['name']!, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(item['date']!),
            trailing: TextButton(
              child: Text(item['status']!),
              onPressed: () {
                // Todo: Implement result viewing logic
              },
            ),
          ),
        );
      },
    );
  }

  Widget _buildPastSurgeriesList(List<Map<String, String>> items) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return Card(
          color: Colors.white.withAlpha(220),
          margin: const EdgeInsets.only(bottom: 15),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            leading: const Icon(Icons.history_edu_outlined, color: Color(0xFF0095D1), size: 40),
            title: Text(item['name']!, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(item['date']!),
          ),
        );
      },
    );
  }
}
