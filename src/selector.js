var traverseDomAndCollectElements = function(matchFunc, startEl) {
  var resultSet = [];

  if (typeof startEl === "undefined") {
    startEl = document.body;
  }

 if(matchFunc(startEl)){
  resultSet.push(startEl)
 }
  if(startEl.children.length > 0){
    for( var i=0; i<startEl.children.length; i++){
      resultSet = resultSet.concat(traverseDomAndCollectElements(matchFunc, startEl.children[i]));
    }
    
  }
  return resultSet;
};

// Detecta y devuelve el tipo de selector
// devuelve uno de estos tipos: id, class, tag.class, tag


var selectorTypeMatcher = function(selector) {
  if(selector[0]==='#') return 'id';
  if(selector[0]==='.') return 'class';
  if(selector.includes('.')) return 'tag.class';
  if(selector.includes('>')) return 'child'
  if(selector.includes(' ')) return 'descendant'
  return 'tag';  
};

// NOTA SOBRE LA FUNCIÓN MATCH
// recuerda, la función matchFunction devuelta toma un elemento como un
// parametro y devuelve true/false dependiendo si el elemento
// matchea el selector.

var matchFunctionMaker = function(selector) {
  var selectorType = selectorTypeMatcher(selector);
  var matchFunction;
  if (selectorType === "id") {
    matchFunction = function (node){
      return "#" + node.id===selector;
    }
  } else if (selectorType === "class") {
    matchFunction = function(node){
      var classArray = node.className.split(' ');
      var delSelector = selector.slice(1);
      return classArray.includes(delSelector)
    }
  } else if (selectorType === "tag.class") {
    matchFunction = function(node){
      var tagClassArray =selector.split('.');
      var tag = tagClassArray[0];
      var clas = tagClassArray[1];
      var matcherTag = matchFunctionMaker(tag);
      var matcherClas = matchFunctionMaker('.' + clas);
     
      return matcherTag(node) && matcherClas(node);
    }
  } else if (selectorType === "tag") {
    matchFunction = function(node){
      return node.tagName === selector.toUpperCase();
    }
  } else if(selectorType === "child"){
    matchFunction = function(node){
      var array = selector.split('>');
      var parent = array[0].trim();
      var child = array[1].trim(); 
      return node.tagName === child.toUpperCase() && node.parentNode.tagName === parent.toUpperCase();
    }
  } else if(selectorType === 'descendant'){
    matchFunction = function(node, i = 0){
      var array = selector.split(' ');
      var parent = array[0].toUpperCase();
      var child = array[1].toUpperCase();
      if (i === 0) {
        if(node.tagName===child){
          if(node.parentNode.tagName===parent){
            return true;
          }else{
            return matchFunction(node.parentNode, 1);
          }
        }  
      } else {
        if (node.tagName===parent) {
          return true;
        } else {

          return matchFunction(node.parentNode, 1); 
        }
      }
    }
  }

  return matchFunction;

};

var $ = function(selector) {
  var elements;
  var selectorMatchFunc = matchFunctionMaker(selector);
  elements = traverseDomAndCollectElements(selectorMatchFunc);
  return elements;
};
