export function formatValue(obj) {
  for (const propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ''
    ) {
      delete obj[propName];
    }
  }
  return obj;
}

export function updateTextView(_obj) {
  var num = getNumber(_obj);
  if (num == 0) {
    return '';
  } else {
    return num.toLocaleString();
  }
}
function getNumber(_str) {
  var arr = _str.split('');
  var out = new Array();
  for (var cnt = 0; cnt < arr.length; cnt++) {
    if (isNaN(arr[cnt]) == false) {
      out.push(arr[cnt]);
    }
  }
  return Number(out.join(''));
}
