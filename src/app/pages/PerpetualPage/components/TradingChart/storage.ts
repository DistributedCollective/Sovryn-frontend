/**
 * Implementation of TradingView Charting Library api (v18.043)
 * for saving/loading of Chart Layouts (drawings) and Study Templates (indicators)
 * using localStorage as lightweight storage solution.
 *
 * More information on this and other solutions can be found here:
 * https://github.com/tradingview/charting_library/wiki/Saving-and-Loading-Charts/0918ee9f5215ebd5a06d0ec9ee2bdffbd5822342
 */
import { v4 as uuid } from 'uuid';
import { local } from 'utils/storage';
import { chartStorageKey } from 'utils/classifiers';
import { IExternalSaveLoadAdapter } from '@distributedcollective/charting-library/src/charting_library/charting_library.min';

type StoredCharts = {
  [id: string]: ChartData;
};

type ChartData = {
  id: string;
  name: string;
  symbol: string;
  resolution: string;
  content: string;
  timestamp: number;
};

type StoredTemplates = {
  [id: string]: TemplateData;
};

type TemplateData = {
  name: string;
  content: string;
};

/** Local storage keys */
const LAYOUT_KEY = `${chartStorageKey}.layouts`;
const TEMPLATE_KEY = `${chartStorageKey}.templates`;

const getJSON = (key: string) => JSON.parse(local.getItem(key) || '{}');
const setJSON = (key: string, obj: any) =>
  local.setItem(key, JSON.stringify(obj));

// Details on implemented methods can be found here:
// https://github.com/tradingview/charting_library/wiki/Saving-and-Loading-Charts/0918ee9f5215ebd5a06d0ec9ee2bdffbd5822342#api-handlers
const tradingChartStorage: IExternalSaveLoadAdapter = {
  /** Chart Layout (drawing) methods **/
  getAllCharts: () => Promise.resolve(Object.values(getJSON(LAYOUT_KEY)) || []),

  removeChart: (chartID: string) => {
    const storedCharts: StoredCharts = getJSON(LAYOUT_KEY);
    if (!storedCharts) return Promise.reject();
    if (storedCharts[chartID]) delete storedCharts[chartID];
    setJSON(LAYOUT_KEY, storedCharts);
    return Promise.resolve();
  },

  saveChart: (chartData: ChartData) => {
    let updatedCharts: StoredCharts = getJSON(LAYOUT_KEY);
    let chartID = chartData.id;
    if (!updatedCharts[chartID]) chartID = uuid();
    updatedCharts[chartID] = {
      ...chartData,
      id: chartID,
      timestamp: Date.now() / 1e3,
    };
    setJSON(LAYOUT_KEY, updatedCharts);
    return Promise.resolve(chartID);
  },

  getChartContent: (chartID: string) => {
    const storedCharts = getJSON(LAYOUT_KEY);
    return storedCharts[chartID]
      ? Promise.resolve(storedCharts[chartID].content)
      : Promise.reject();
  },

  /** Chart Study Template (indicator) methods **/
  getAllStudyTemplates: () =>
    Promise.resolve(Object.values(getJSON(TEMPLATE_KEY)) || []),

  removeStudyTemplate: (studyTemplateData: TemplateData) => {
    let storedTemplates: StoredTemplates = getJSON(TEMPLATE_KEY);
    if (!storedTemplates) return Promise.reject();
    if (storedTemplates[studyTemplateData.name])
      delete storedTemplates[studyTemplateData.name];
    setJSON(TEMPLATE_KEY, storedTemplates);
    return Promise.resolve();
  },

  saveStudyTemplate: (studyTemplateData: TemplateData) => {
    let updatedTemplates: StoredTemplates = getJSON(TEMPLATE_KEY);
    updatedTemplates[studyTemplateData.name] = studyTemplateData;
    setJSON(TEMPLATE_KEY, updatedTemplates);
    return Promise.resolve();
  },

  getStudyTemplateContent: (studyTemplateData: TemplateData) => {
    const storedTemplates: StoredTemplates = getJSON(TEMPLATE_KEY);
    return storedTemplates[studyTemplateData.name]
      ? Promise.resolve(storedTemplates[studyTemplateData.name].content)
      : Promise.reject();
  },
};

export default tradingChartStorage;
