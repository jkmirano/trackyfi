import { Component } from '@angular/core';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss']
})
export class StatisticsPage {
  // general
  loading: boolean = true;

  // Pie
  pieData = [
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
  pieOptions: any = {
    "title": "Income/Savings",
    "resizable": true,
    "height": "400px",
    "pie": {
      "alignment": "center"
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

  // Table
  tableModel: TableModel = new TableModel();
  tableDataTemp = [
    {
      name: 'Rent',
      expected: 1000,
      actual: 800,
      due: 'n/a',
      variance: 200
    },
    {
      name: 'Rent',
      expected: 1000,
      actual: 800,
      due: 'n/a',
      variance: 200
    },
    {
      name: 'Rent',
      expected: 1000,
      actual: 800,
      due: 'n/a',
      variance: 200
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.initTable();
  }

  initTable() {
    this.tableModel.header = [
      new TableHeaderItem({ data: 'Name' }),
      new TableHeaderItem({ data: 'Expected' }),
      new TableHeaderItem({ data: 'Actual' }),
      new TableHeaderItem({ data: 'Due' }),
      new TableHeaderItem({ data: 'Variance' }),
    ];
    let tableData: TableItem[][] = this.tableDataTemp.map(data => {
      let newRow: TableItem[] = [];
      newRow.push(new TableItem({ data: data.name }));
      newRow.push(new TableItem({ data: data.expected }));
      newRow.push(new TableItem({ data: data.actual }));
      newRow.push(new TableItem({ data: data.due }));
      newRow.push(new TableItem({ data: data.variance }));
      return newRow;
    });

    this.tableModel.data = tableData;
    this.loading = false;
  }

}
