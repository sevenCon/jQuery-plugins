(function(window){
    var Calender = function(dateHeaderSelector, selector){
        this.dateHeaderSelector = dateHeaderSelector;
        this.selector = selector;
        this.remindEvents = remindEvents;
        
        this.changeMonthData(0); // 设月份默认当月
        this.initialMonthDate(); // 初始化天数
        this.serilizeHTML(); // 格式化表格
    }
    Calender.now = {
        year:2017,
        month:2,
        monthString: "02"
    }
    Calender.monthDate = [];

    Calender.prototype.serilizeHTML = function(){
        var data = Calender.monthDate,
            events = this.remindEvents,
            dateHeaderSelector = this.dateHeaderSelector,
            selector = this.selector,
            _root = $(selector);

        _root.find("tbody").children().remove();
        $(dateHeaderSelector).find(".yy-mm-text").text(Calender.now.year+' 年 '+Calender.now.monthString+' 月 ');

        for(var i = 0, length = data.length; i < length; i++ ){
            var aTrTdHTMl = $("<tr>");

            for(var j = 0, _length = data[i].length; j < _length; j++){
                var today = data[i][j],
                    dateItemHTML = $("<td>"),
                    dateNum = $("<div class='td-date-item'><span class='date-string'></span></div>");

                // is last month date?
                var _flag = today.m != Calender.now.month ? 1 : 0;
                dateNum.find(".date-string").text( _flag ? today.m + "月" + today.date : today.date);
                _flag && dateNum.find(".date-string").addClass("color-gray");
                dateItemHTML.append(dateNum);

                // has remind events ? yes and include
                var tdEvents = filterTodayEvents(events, Calender.now.year + "-" + data[i][j].m + "-" + data[i][j].date);
                if(tdEvents.length>0){
                    var aUlist = $("<ul class=event-list></ul>");
                    tdEvents.forEach(function(item){
                        var aLi = $("<li>");
                        aLi.html("<p>"+item.eventName.toString()+"</p>");
                        aUlist.append(aLi);
                    });
                    dateItemHTML.append(aUlist);
                }
                
                
                
                aTrTdHTMl.append(dateItemHTML);
            }
            _root.append(aTrTdHTMl);
        }
    }
    /**
     * @mode  :-1 上一个月， mode:1 下一个月， mode:0 本月
     */
    Calender.prototype.changeMonthData = function(mode){
        switch(mode){
            case -1:
                var isFirstMonth = Calender.now.month == 1? true : false;
                isFirstMonth && Calender.now.year--,
                isFirstMonth && (Calender.now.month = 12) || Calender.now.month--;
                break;
            case 1:
                var isLastMonth = Calender.now.month == 12? true : false;
                isLastMonth && Calender.now.year++,
                isLastMonth && (Calender.now.month = 1) || Calender.now.month++;
                break;
            case 0:
                Calender.now.year = new Date().getFullYear();
                Calender.now.month = new Date().getMonth()+1;
                break;
        }
        var _montoString = Calender.now.month.toString();
        Calender.now.monthString = _montoString.length == 1 && '0' + _montoString || _montoString;
    }

    /**
     * 初始化该月的7x6的天数
     */
    Calender.prototype.initialMonthDate = function(){
        var _year = Calender.now.year,
            lastYear = _year - 1,
            nextYear = _year + 1,
            _mouth = Calender.now.month,
            _monthString = _mouth.toString().length == 1 && '0' + _mouth || _mouth.toString(),
            
            lastMonth = { // 上一个月的信息
                month: _mouth - 1 == 0 ? 12 :_mouth-1,
                isLastYear: _mouth-1 == 0 ? true : false
            },
            nextMonth = { // 下一个月的信息
                month: _mouth + 1 == 13 ? 1 :_mouth + 1,
                isNextYear: _mouth+1 == 13 ? true : false
            };

        Calender.now.year = _year;
        Calender.now.month = _mouth;
        Calender.now.monthString = _monthString;

        _days = getDatesInMonth(_year,_mouth);

        var lastMonthDates = getDatesInMonth(lastMonth.isLastYear?lastYear:_year,lastMonth.month); // 上一个月有多少天
        var nextMonthDates = getDatesInMonth(nextMonth.isLastYear?nextYear:_year,nextMonth.month); // 下一个月有多少天

        var firsDateInWeek = new Date(_year+"-"+_monthString+"-01").getDay(),
            lastDateInWeek = new Date(_year+"-"+_monthString+"-"+_days).getDay(),
            lastMonthNeeded = firsDateInWeek,
            nextMonthNeeded = lastDateInWeek == 6 && 7 || 7 - 1 - lastDateInWeek;
        
        // 前补齐的number列表,[1,2] 格式，数字
        var preDaysNum = lastMonthNeeded && Object.keys(Array.apply(null, {length: lastMonthDates + 1})).slice(-lastMonthNeeded).map(function(item){
            return {m:lastMonth.month,date:+item};
        }) ||[]; 

        var thisMonthDaysNum = Object.keys(Array.apply(null, {length: _days + 1})).slice(1).map(function(item){
            return {m:_mouth,date:+item};
        }); 
        // 后补齐的number列表
        var subDaysNum = Object.keys(Array.apply(null, {length: nextMonthNeeded + 1})).slice(1, nextMonthNeeded+1).map(function(item){
            return {m:nextMonth.month,date:+item};
        }); 
        var _allDays = preDaysNum.concat(thisMonthDaysNum,subDaysNum);

        Calender.monthDate = group(_allDays,7);

        console.log("前补齐number",Calender.monthDate);

        // 判断天数是否缺一行，一共6行
        var isLess = Calender.monthDate.length < 6 && true;
        if(isLess){
            var lessDates =[];
            var lastObjMonth =  subDaysNum[nextMonthNeeded-1].m;
            var lastObjDate =  subDaysNum[nextMonthNeeded-1].date;
            lessDates = Object.keys(Array.apply(null,{length:lastObjDate + 7 + 1})).slice(lastObjDate+1).map(function(item){
                return {m:lastObjMonth,date:+item};
            });
            Calender.monthDate.push(lessDates);
        }
    }

    Calender.prototype.initNextMonth = function(){
        Calender.changeMonthData(1);
        Calender.initialMonthDate();
        Calender.serilizeHTML("#date-top-bar","#calender");
    }
    Calender.prototype.initLastMonth = function(){
        Calender.changeMonthData(-1);
        Calender.initialMonthDate();
        Calender.serilizeHTML("#date-top-bar","#calender");
    }
    Calender.prototype.cheakEvent = function(element,elem){
        var _element = element.time.split('-');
        return  elem.m == element.time.split('-')[1] &&
                dataCalender.now.year == element.time.split('-')[0] && 
                elem.date == element.time.split('-')[2];
    }
       
/**
 * #desc: 根据日期过滤事件
 * @envent: "2014-2-2",  
 * @dateStr: [{ time:"2014-2-2",eventName:"10.25, 开始上课"},...]
 * @return: [res]
 */
function filterTodayEvents(events,dateStr){
    var res = [];
    res = events.filter(function(item){
        return item.time == dateStr
    });
    return res;
}

/**
 * @year  {"2017"}
 * @_month  {1}
 * @return {42}
 */
function getDatesInMonth(year,_mouth){
    var _days;
    // 当前月的天数
    if(_mouth == 2){
        _days= year % 4 == 0 ? 29 : 28;
    }
    else if(_mouth == 1 || _mouth == 3 || _mouth == 5 || _mouth == 7 || _mouth == 8 || _mouth == 10 || _mouth == 12){
        //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31
        _days= 31;
    }
    else{
        //其他月份，天数为：30.
        _days= 30;
    }
    return _days;
}

/**
 * 数组分组
 * @arr  {[]}
 * @num  {12}
 * @return {[]}
 */
function group(arr, num){
  num = num*1 || 1;
  var ret = [];
  arr.forEach(function(item, i){
    if(i % num === 0){
      ret.push([]);
    }
    ret[ret.length - 1].push(item);
  });
  return ret;
}

    window.Calender = Calender;
})(window||{});



