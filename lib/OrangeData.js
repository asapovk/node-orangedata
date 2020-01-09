const Order = require('./Order');
const Correction = require('./Correction');
const HttpClient = require('./HttpClient');
const { createValidator } = require('./validation');
const { serviceOptions } = require('./validation/schemes');
const { OrangeDataError } = require('./errors');

const validate = createValidator(serviceOptions);

module.exports = class OrangeData {
  constructor(options) {
    const errors = validate(options);
    if (Object.keys(errors).length > 0) throw new Error(JSON.stringify(errors));
    this.httpClient = new HttpClient(options);
  }

  async sendOrder(order) {
    if (order instanceof Order) order.validate();
    else throw new OrangeDataError('Объект документа не является экземпляром класса Order');
    return this.httpClient.post('/documents', order);
  }

  async sendCorrection(order) {
    if (order instanceof Correction) order.validate();
    else throw new OrangeDataError('Объект не является экземпляром класса Correction');
    return this.httpClient.post('/corrections', order);
  }

  async getOrderStatus(inn, id) {
    if (!inn || !id) throw new OrangeDataError('Не указан ИНН или id документа');
    return this.httpClient.get(`/documents/${inn}/status/${id}`);
  }

  async getCorrectionStatus(inn, id) {
    if (!inn || !id) throw new OrangeDataError('Не указан ИНН или id документа');
    return this.httpClient.get(`/corrections/${inn}/status/${id}`);
  }

  async getDevicesStatus(inn, groupName) {
    if (!inn || !groupName) throw new OrangeDataError('Не указан ИНН или groupName');
    return this.httpClient.get(`/devices/status/${inn}/${groupName}`);
  }


};
