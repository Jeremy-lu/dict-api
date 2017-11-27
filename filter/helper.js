'use strict';

const GLOBALERROR = require('../error/global');
const dbHelper = require('../util/db/helper');

module.exports = {
  generate(attrConfigs) {
    let handler = (params, attrHandler) => {
      params = params || {};
      let result = {};

      let newParams = {};

      for(let attr in attrConfigs) {
        let value = params[attr];
        let config = attrConfigs[attr];

        let attrResult = attrHandler(attr, value, config);
        if(!attrResult) continue;
        if(attrResult.error) return attrResult;

        value = attrResult.value;

        // type check and tranlate
        if(value !== null) {
          switch(config.type) {
            case 'number':
              let reg = /\d+/;
              if(reg.test(value)) {
                value = parseInt(value);
              } else {
                result.error = GLOBALERROR.should.be.number(attr);
                return result;
              }
              break;
            case 'string':
              value = String(value);
              break;
            case 'array':
              if(!(value instanceof Array)) {
                result.error = GLOBALERROR.should.be.array(attr);
                return result;
              }
              break;
            case 'boolean':
              if(typeof value !== 'boolean') {
                result.error = GLOBALERROR.should.be.boolean(attr);
                return result;
              }
              break;
            case 'object':
              if(typeof value !== 'object') {
                result.error = GLOBALERROR.should.be.object(attr);
                return result;
              }
              break;
          }

          // validate check
          if(config.validate && !config.validate(value)) {
            // todo: check if error function exist
            result.error = GLOBALERROR.invalid();
            return result;
          }
        }

        newParams[attr] = value;
      }

      result.params = newParams;

      return result;
    };

    return {
      id(id) {
        let reg = /\d+/;
        return reg.test(id);
      },

      create(params) {
        return handler(params, (attr, value, config) => {
          if(config.creatable === false) return false;

          let result = {};

          // not null check
          if(config.notNull && (value === null || value === undefined)) {
            if(config.default !== undefined) {
              value = config.default;
            } else {
              // todo: check if error function exist
              result.error = { code: 88888, text: `${attr}不能为空` };
              return result;
            }
          }

          if(value === undefined) return false;

          result.value = value;

          return result;
        });
      },

      update(params) {
        return handler(params, (attr, value, config) => {
          if(config.updatable === false) return false;

          if(value === undefined) return false;

          // not null check
          if(config.notNull && (value === null)) return false;

          return { value };
        });
      },

      select(params) {
        return handler(params, (attr, value, config) => {
          if(config.selectable === false) return false;

          if(value === undefined) return false;

          if(value === '') value = null;

          return { value };
        });
      },

      return(data) {
        let defaultAttrList = ['id', 'createdAt', 'updatedAt'];

        let filter = (obj) => {
          for(let attr in obj) {
            if(defaultAttrList.indexOf(attr) > -1) continue;

            let config = attrConfigs[attr];

            if(!config || config.returnable === false) {
              delete obj[attr];
            }
          }

          return obj;
        };

        if(data instanceof Array) {
          return data.map(filter);
        } else {
          return filter(data);
        }
      },

      getFuzzySearch(searchStr, tableName) {
        if(!searchStr) return null;

        let tmpObj = {};

        for(let attr in attrConfigs) {
          let config = attrConfigs[attr];
          if(config.fuzzySearch) {
            attr = tableName ? `${tableName}.${attr}` : attr;
            tmpObj[attr] = searchStr;
          }
        }

        return dbHelper.getOrQuery(tmpObj);
      }
    };
  }
};
