import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseService } from '../../../services/case.service';

// This is the correct import path for ng2-charts v4+
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js'; // Import Chart types from chart.js

import { CaseMapComponent } from '../../shared/case-map/case-map';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    NgChartsModule, 
    CaseMapComponent
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  analyticsData: any = null;
  hotspotCases: any[] = [];

  // Chart Configurations
  public statusChartType: ChartType = 'pie';
  public volunteerChartType: ChartType = 'bar';

  public statusChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public volunteerChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  
  // THE FIX: New, theme-aware chart options
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Allows for better sizing in flex/grid layouts
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2c5f7c', // Dark text for legend
          font: {
            family: "'Poppins', sans-serif",
            size: 14
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#5a7c8f' }, // Muted text for axis labels
        grid: { color: 'rgba(130, 205, 224, 0.2)' } // Light, theme-colored grid lines
      },
      y: {
        ticks: { color: '#5a7c8f' },
        grid: { color: 'rgba(130, 205, 224, 0.2)' }
      }
    }
  };

  averageResolutionTime: string = 'N/A'; // <-- New property


  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    this.caseService.getAnalytics().subscribe(data => {
      this.analyticsData = data;
      this.prepareCharts();
      this.formatAverageTime(data.averageResolutionTime); // <-- Call the new formatter
      this.hotspotCases = data.hotspots.map((spot: any) => ({
        address: `${spot._id} (${spot.count} cases)`,
        location: { coordinates: spot.coords }
      }));
    });
  }

  prepareCharts(): void {
    if (!this.analyticsData) return;

    // Prepare data for the Case Status pie chart
    this.statusChartData = {
      labels: this.analyticsData.statsByStatus.map((s: any) => s._id),
      datasets: [{
        data: this.analyticsData.statsByStatus.map((s: any) => s.count),
        backgroundColor: ['#82cde0', '#28a745', '#ffc107', '#aec8d8', '#cac9d0'],
        hoverBackgroundColor: ['#95c9de', '#34c759', '#ffd24d', '#c1d7e3', '#dde2e5'],
        borderColor: '#ffffff', // Add a white border for a clean look
        borderWidth: 2
      }]
    };

    // Prepare data for the Volunteer Performance bar chart
    this.volunteerChartData = {
      labels: this.analyticsData.volunteerPerformance.map((v: any) => v.volunteerName),
      datasets: [{
        data: this.analyticsData.volunteerPerformance.map((v: any) => v.resolvedCount),
        label: 'Resolved Cases',
        backgroundColor: '#95c9de',
        hoverBackgroundColor: '#95c9de',
        borderRadius: 4
      }]
    };
  }

    formatAverageTime(ms: number): void {
    if (!ms || ms === 0) {
      this.averageResolutionTime = 'N/A';
      return;
    }
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    this.averageResolutionTime = `${hours}h ${minutes}m`;
  }
}