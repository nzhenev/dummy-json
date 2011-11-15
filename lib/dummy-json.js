/*!
 * dummy-json
 * Copyright(c) 2011 Zhenev Nikita <nikita@andcreative.ru>
 * MIT Licensed
 */

/**
 * Module dependencies
 */
var _ = require('underscore')
  , data = require('./data');

/**
 * Main function
 */
var init = module.exports = function init() {
  var r = {
    // Import data from library
    // --
    firstNames: data.maleNames,
    surNames: data.surNames,
    domainZones: data.domainZones,
    companyNames: data.companyNames,
    titles: data.titles,
    descriptions: data.descriptions,
    tags: data.tags,
    countries: data.countries,
    cities: data.cities,
    
    // Basic data types
    // ---
    $int: function(min, max) {
      if (!max) {
        max = min;
        min = 0;
      }
      return min + Math.floor(Math.random()*(max + 1))
    },
    $bool: function(val) {
      return !Boolean(Math.floor(Math.random()*2))
    },
    
    // Dates
    // ---
    $date: function() {
      var startMillis = new Date(new Date().getFullYear() - 2,0,1).getTime();
      var endMillis = new Date(new Date().getFullYear(), 12,31).getTime();
      return new Date(startMillis + Math.random()*(endMillis-startMillis));
    },
    $dateGreaterThan: function(arg) {
      var startMillis = new Date(arg).getTime();
      var endMillis = new Date(new Date(arg).getFullYear() + 1, 1, 0).getTime();
      return new Date(startMillis + Math.random()*(endMillis-startMillis));
    },
    $dateLessThan: function(arg) {
      var startMillis = new Date(new Date(arg).getFullYear() - 1, 1, 0).getTime();
      var endMillis = new Date(arg).getTime();
      return new Date(startMillis + Math.random()*(endMillis-startMillis));
    },
    $dateInRange: function(arg1, arg2) {
      var startMillis = new Date(arg1).getTime();
      var endMillis = new Date(arg2).getTime();
      return new Date(startMillis + Math.random()*(endMillis-startMillis));
    },
    
    // Person information
    // ---
    $firstName: function() {
      return r.firstNames[r.$int(r.firstNames.length - 1)]
    },
    $surName: function() {
      return r.surNames[r.$int(r.surNames.length - 1)]
    },
    
    // Geo
    // ---
    $country: function() {
      return r.countries[r.$int(r.countries.length - 1)]
    },
    $city: function() {
      return r.cities[r.$int(r.cities.length - 1)]
    },
    
    // Business information
    // ---
    $company: function() {
      return r.companyNames[r.$int(r.companyNames.length - 1)]
    },
    $domain: function(company) {
      company = company || r.$company()
      return r.$trans(company, 0)
    },
    $domainZone: function() {
      return r.domainZones[r.$int(r.domainZones.length - 1)]
    },
    $emailFromData: function(user, company, domainZone) {
      domainZone = domainZone || r.$domainZone()
      return r.$trans(user.replace(/ /g, '.'), 0).toLowerCase() + "@" + r.$trans(company.replace(/ /g, ''), 0).toLowerCase() + domainZone
    },
    $email: function() {
      return r.$emailFromData(r.$firstName() + " " + r.$surName(), r.$company(), r.$domainZone())
    },
    $code: function(template) {
      template = template || "#######"
      tmpl = _.template(template.replace(/#/g, '<%= random_num() %>'));
      return tmpl({
        random_num: function() { return Math.floor(Math.random()*9).toString() }
      })
    },
    
    // Content
    // --
    $trans: function(w, v) {
      var tr='a b v g d e ["zh","j"] z i y k l m n o p r s t u f h c ch sh ["shh","shch"] ~ y ~ e yu ya ~ ["jo","e"]'.split(' ');
      var ww=''; w=w.toString().toLowerCase().replace(/ /g,'');
      for(i=0; i<w.length; ++i) {
       cc=w.charCodeAt(i); ch=(cc>=1072?tr[cc-1072]:w[i]);
       if(ch.length<3) ww+=ch; else ww+=eval(ch)[v];
      }
      return(ww.replace(/~/g,''));
     },
     $title: function() {
       return r.titles[r.$int(r.titles.length - 1)]
     },
     $description: function(pCount) {
       pCount = pCount || 1;
       var res = '';
       _.each(_.range(0, pCount), function(i) {
         if (res.length == 0) {
           res = r.descriptions[r.$int(r.descriptions.length - 1)];
         } else {
           res += "\n\n" + r.descriptions[r.$int(r.descriptions.length - 1)];
         }
       });
       return res
     },
     $tag: function() {
       return r.tags[r.$int(r.tags.length - 1)]
     },
     $tags: function(count) {
       var res = new Array();
       _.each(_.range(0, count), function(i) {
         res.push(r.$tag());
       });
       return res
     }
  }
  var prepare = function(str) {
    // __TODO__: Add normal tokenizer here
    // Underscore symbol is replaced into next js code: `+ " " +`
    if (str[0] == '<' && str[str.length - 1] == '>') {
      //str[0] = '(';
      str = 'eval(' + str.substring(1, str.length - 1) + ')';
      //str[str.length - 1] = ')';
      //str = str[0]= 'eval(').replace('>', ')')
    }
    return str.replace(/\_\$\./g, ' + " " + $.') + ';'
  };
  
  var randomizer = function(obj, parent) {
    //r.$me = obj;
    r.$parent = parent || {};
    r.$inc = 0;
    r.$ = obj;
    _.each(_.keys(obj), function(key) {
      if (_.isString(obj[key])) {
        r.me = obj;
        with(r){
          console.log(prepare(obj[key]))
          obj[key] = eval(prepare(obj[key]));
          if (_.isFunction(obj[key])) {
            obj[key] = obj[key]();
          }
        }
      } else if (_.keys(obj).length == _.values(obj).length){
        obj[key] = randomizer(obj[key], obj);
      }
    }, this);
    return obj
  };
  return randomizer
}