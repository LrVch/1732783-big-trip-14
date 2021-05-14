import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import SmartView from './smart.js';
import {
  getCountByTypeAsArray,
  getMoneySpendByTypeAsArray,
  sortByValueDesc,
  getTimeSpendByTypeAsArray
} from '../utils/stats.js';
import { formatToDuration } from '../utils/format.js';

const BAR_HEIGHT = 55;

const renderChart = (ctx, data, title, formatter = (val) => val) => {
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: data.map((elem) => elem.type.toUpperCase()),
      datasets: [
        {
          data: data.map((elem) => elem.value),
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter,
        },
      },
      title: {
        display: true,
        text: title,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderMoneyChart = (ctx, events) => {
  const data = sortByValueDesc(getMoneySpendByTypeAsArray(events));

  ctx.height = BAR_HEIGHT * data.length;

  return renderChart(ctx, data, 'MONEY', (val) => `€ ${val}`);
};

const renderCountChart = (ctx, events) => {
  const data = sortByValueDesc(getCountByTypeAsArray(events));

  ctx.height = BAR_HEIGHT * data.length;

  return renderChart(ctx, data, 'TYPE', (val) => `${val}x`);
};

const rendeTimeSpendChart = (ctx, events) => {
  const data = sortByValueDesc(getTimeSpendByTypeAsArray(events));

  ctx.height = BAR_HEIGHT * data.length;

  return renderChart(ctx, data, 'TIME SPEND', formatToDuration);
};

const createStatsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class Stats extends SmartView {
  constructor(events) {
    super();

    this._data = {
      events,
    };

    this._moneyChart = null;
    this._countChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  removeElement() {
    super.removeElement();

    if (
      this._moneyChart !== null ||
      this._countChart !== null ||
      this._timeSpendChart !== null
    ) {
      this._moneyChart = null;
      this._countChart = null;
      this._timeSpendChart = null;
    }
  }

  _setCharts() {
    if (
      this._moneyChart !== null ||
      this._countChart !== null ||
      this._timeSpendChart !== null
    ) {
      this._moneyChart = null;
      this._countChart = null;
      this._timeSpendChart = null;
    }

    const { events } = this._data;

    const moneyChart = this.getElement().querySelector(
      '.statistics__chart--money',
    );
    const countChart = this.getElement().querySelector(
      '.statistics__chart--transport',
    );
    const timeSpendChart = this.getElement().querySelector(
      '.statistics__chart--time',
    );

    this._moneyChart = renderMoneyChart(moneyChart, events);
    this._countChart = renderCountChart(countChart, events);
    this._timeSpendChart = rendeTimeSpendChart(timeSpendChart, events);
  }
}
