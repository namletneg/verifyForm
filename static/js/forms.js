/**
 * Created by Administrator on 2014/7/30.
 */
var Forms = {
    blur: function(event,regString,spanText,min,max){
        event.bind('blur',function(){
            var value = $.trim(event.val());
            var span = event.next();
            var count = Forms.realLength(value);
            var regular = new RegExp(regString);
            if(count == 0){
                event.addClass('mustFill').css({'border-color':'#f00','background-color':'#fff8ee'});
                span.addClass('red-font').html("<i class='icon-error'></i>此项为必填项</span>");
            }
            else if(count < min || count > max){
                event.addClass('mustFill').css({'border-color':'#f00','background-color':'#fff8ee'});
                span.addClass('red-font').html("<i class='icon-error'></i>请输入" + min + "-" + max + "个字符</span>")
            }
            else{
                if(regular.test(value)){
                    //判断用户名是否存在
                    if(event[0].id == 'name'){
                        $.getJSON('./static/json/user.json',{name:$(this).val()},function(json){
                            for(i = 0; i < json.length; i++){
                                if(json[i].name == value){
                                    event.addClass('mustFill').css({'border-color':'#f00','background-color':'#fff8ee'});
                                    span.addClass('red-font').html("<i class='icon-error'></i>企业名称已存在</span>");
                                    break;
                                }
                                else{
                                    event.removeClass('mustFill').css({'border-color':'#ccc','background-color':''});
                                    span.removeClass('red-font').html("<i class='icon-ok'></i></span>");
                                }
                            }
                        });
                    }
                    else{
                        event.removeClass('mustFill').css({'border-color':'#ccc','background-color':''});
                        span.removeClass('red-font').html("<i class='icon-ok'></i></span>");
                    }
                }
                else{
                    event.addClass('mustFill').css({'border-color':'#f00','background-color':'#fff8ee'});
                    span.addClass('red-font').html("<i class='icon-error'></i>"+ spanText + "</span>");
                }
            }
        })
    },
    realLength: function(valLength){
        var count = 0;
        for(i = 0; i < valLength.length; i++){
            if(this.isChinese(valLength.charAt(i)) == true){
                count += 2;          // Chinese is 2 char
            }
            else{
                count += 1;
            }
        }
        return count;
    },
    // Chinese detection
    isChinese: function (str) {
        var reCh = /[\u4e00-\u9fa5]/;
        return reCh.test(str);
    }
};
Forms.blur($('#name'),'^[A-Za-z0-9\u4e00-\u9fa5]+$' ,'请输入字母或数字或中文',5,25);
Forms.blur($('#password'),'^\\w+$' ,'6-16个字符的字母加数字或下划线组合',6,16);
Forms.blur($('#e-mail'),'^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w+)+)$','请输入正确格式的E-Mail');


$('.mustFill:not([type=checkbox])').on('focus',function(){
    $(this).next().show();
});
$('.fill[type=checkbox]').on('click',function(){
    var $span = $(this).siblings('span');
    if(this.checked){
        $(this).removeClass('mustFill');
        $span.removeClass('red-font').html("<i class='icon-ok'></i></span>").show();
    } else{
        $(this).addClass('mustFill');
        $span.addClass('red-font').html("<i class='icon-error'></i>此项为必填项</span>").show();
    }
});

//Fill in the information detection
$('form').bind('submit',function(){
    var $mustFill = $('form').find('.mustFill'),
        $span,
        id,top,type;

    if($mustFill[0]){
        id = '#' + $mustFill[0].id;
        top = $(id).offset().top - 200;
        type = $mustFill[0].getAttribute('type');
        $span = $($mustFill[0]).siblings('span');

        $span.addClass('red-font').html("<i class='icon-error'></i>此项为必填项</span>");
        $(window).scrollTop(top);
        if(type !== 'checkbox'){
            $mustFill[0].select();
        } else{
            $span.show();
        }
        return false;               //Stop the form submit
    }
});
