import { Component } from '@angular/core';
import * as HighCharts from 'highcharts';

@Component({
  selector: 'app-high-chart',
  templateUrl: 'high-chart.page.html',
  styleUrls: ['high-chart.page.scss'],
})
export class HighChartPage {
  constructor() { }

  ionViewDidEnter() {
    this.plotSimpleBarChart();
  }

  plotSimpleBarChart() {
    let categoryArr = ['A','A','A','A','A','A','A','A','A','A','A','A'];
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
        text: 'Fruit Consumption',
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
        lineWidth: 1,
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