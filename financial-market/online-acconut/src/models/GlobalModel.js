import { observable, action, computed } from 'mobx';

class GlobalModel {
  @observable number = 1;
  @computed get total() {
    return this.number * 300;
  }
  @action addNumber(num) {
    this.number += num;
  }
}

export default new GlobalModel();
