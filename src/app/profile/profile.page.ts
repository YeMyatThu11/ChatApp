import { Component, OnInit } from '@angular/core';

import * as HighCharts from 'highcharts';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.plotSimpleBarChart();
  }
  plotSimpleBarChart() {
    let categoryArr = ['25/12/2020','26/12/2020','27/12/2020','28/12/2020','30/12/2020','31/12/2020','1/1/2021','2/1/2021','3/1/2021','4/1/2021','5/1/2021','6/1/2021'];
    let myChart = HighCharts.chart('highcharts', {
      colors: ['#777777'],
      credits: {
        enabled: false
      },
      legend: {
        enabled: false
     },
      chart: {
        type: 'line'
      },
      title: {
        text: 'User Usage',
      },
      tooltip: {
        backgroundColor: '#777777',
        borderRadius: 5,
        animation:true,
        enabled: true,
      },
      xAxis: {
        categories: categoryArr,
        lineColor: '#333333',
        lineWidth: 0,
        labels: {
          enabled: false,
  
        },
        title: {
          style: {
            display :'none'
          }
        },
      },
      yAxis: {
        title: {
          style: {
            display :'none'
          }
        },
        gridLineDashStyle: 'Dot',
        gridLineColor: '#777777',
        labels: {
          distance: 5,
          enabled: false
        }
      },
      plotOptions: {
        series: {
            marker: {
                fillColor: '#FFFFFF',
                lineWidth: 2,
                lineColor: null // inherit from series
            }
        }
    },
      series: [
        {
          type: undefined,
          data: [1, 5, 4.5, 1, 5, 9, 5.5, 8,10,9,8,19],
        }]
    });
  }

}
