import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  // Chart
  // -- Meter
  meterData: any = [
    {
      "group": "Savings",
      "value": 10000
    },
    {
      "group": "Income",
      "value": 5000
    },
    {
      "group": "Expenses",
      "value": 2000
    },
    {
      "group": "Loans",
      "value": 3000
    }
  ];
  meterOptions: any = {
    "title": "Overview",
    "height": "130px",
    "meter": {
      "proportional": {
        "total": 20000,
        "unit": "Dollars"
      }
    },
    "color": {
      "pairing": {
        "option": 2
      }
    },
    "theme": "g90"
  }
  // -- Donut
  donutData: any = [
    {
      "group": "Bills",
      "value": 10000
    },
    {
      "group": "Housing",
      "value": 300
    },
    {
      "group": "Food",
      "value": 1500
    },
    {
      "group": "Miscellaneous",
      "value": 800
    },
  ];
  donutOptions: any = {
    "title": "Expenses",
    "resizable": true,
    "height": "400px",
    "donut": {
      "alignment": "center",
      "center": {
        "numberFormatter": ((val: any) => `$${val.toLocaleString()}`)
      }
    },
    "legend": {
      "alignment": "center"
    },
    "theme": "g90"
  }
  // -- Line
  lineData: any = [
    {
      "group": "Dataset 1",
      "key": "Qty",
      "value": 34200
    },
    {
      "group": "Dataset 1",
      "key": "More",
      "value": 23500
    },
    {
      "group": "Dataset 1",
      "key": "Sold",
      "value": 53100
    },
    {
      "group": "Dataset 1",
      "key": "Restocking",
      "value": 42300
    },
    {
      "group": "Dataset 1",
      "key": "Misc",
      "value": 12300
    },
    {
      "group": "Dataset 2",
      "key": "Qty",
      "value": 34200
    },
    {
      "group": "Dataset 2",
      "key": "More",
      "value": 53200
    },
    {
      "group": "Dataset 2",
      "key": "Sold",
      "value": 42300
    },
    {
      "group": "Dataset 2",
      "key": "Restocking",
      "value": 21400
    },
    {
      "group": "Dataset 2",
      "key": "Misc",
      "value": 0
    },
    {
      "group": "Dataset 3",
      "key": "Qty",
      "value": 41200
    },
    {
      "group": "Dataset 3",
      "key": "More",
      "value": 18400
    },
    {
      "group": "Dataset 3",
      "key": "Sold",
      "value": 34210
    },
    {
      "group": "Dataset 3",
      "key": "Restocking",
      "value": 1400
    },
    {
      "group": "Dataset 3",
      "key": "Misc",
      "value": 42100
    },
    {
      "group": "Dataset 4",
      "key": "Qty",
      "value": 22000
    },
    {
      "group": "Dataset 4",
      "key": "More",
      "value": 1200
    },
    {
      "group": "Dataset 4",
      "key": "Sold",
      "value": 9000
    },
    {
      "group": "Dataset 4",
      "key": "Restocking",
      "value": 24000,
      "audienceSize": 10
    },
    {
      "group": "Dataset 4",
      "key": "Misc",
      "value": 3000,
      "audienceSize": 10
    }
  ];
  lineOptions: any = {
    "title": "Income/Savings",
    "axes": {
      "bottom": {
        "title": "2019 Annual Sales Figures",
        "mapsTo": "key",
        "scaleType": "labels"
      },
      "left": {
        "mapsTo": "value",
        "title": "Conversion rate",
        "scaleType": "linear"
      }
    },
    "height": "400px",
    "theme": "g90"
  }

  constructor() {}

  ngOnInit(): void {
    
  }

}
