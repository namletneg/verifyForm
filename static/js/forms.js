/**
 * Created by Administrator on 2014/7/30.
 */
var Forms = {
    blur: function(event,regString,spanText,min,max){
        event.bind('blur',function(){
            var value = $.trim(event.val());
            var span = event.siblings('span');
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
        $span,$active,
        top,type;

    if($mustFill[0]){
        $active = $($mustFill[0]);
        top = $active.offset().top - 200;
        type = $mustFill[0].getAttribute('type');
        $span = $active.siblings('span');

        $span.addClass('red-font').html("<i class='icon-error'></i>此项为必填项</span>");
        $(window).scrollTop(top);
        if(type !== 'checkbox'){
            $mustFill[0].select();
            $active.css({'border-color':'#f00','background-color':'#fff8ee'});
        } else{
            $span.show();
        }
        return false;               //Stop the form submit
    }
});

//绑定验证方法
var beginFill = function(){
    var $mustFill = $('.mustFill'),
        len = $mustFill.length,
        $active,$span,
        type,i;
    for(i = 0; i < len; i++){
        $active = $($mustFill[i]);
        type = $active.attr('type');
        $span = $active.siblings('span');
        if(type === 'text' || type === 'password'){
            if ($active.val() !== '') {
                $active.removeClass('mustFill');
                $span.html("<i class='icon-ok'></i></span>").show();
            }
        }
        if($active.attr('type') === 'checkbox'){
            if($active[0].checked){
                $active.removeClass('mustFill');
                $span.html("<i class='icon-ok'></i></span>").show();
            }
        }
        if($active.hasClass('number')){
            Forms.blur($active,'^[0-9]*$','只能输入数字',1);
        } else if($active.hasClass('idCard')){
            Forms.blur($active,/(^\d{15}$)|(^\d{17}([0-9]|X)$)/,'请输入正确的身份证',1);
        } else if($active.hasClass('email')){
            Forms.blur($active,'^(\\w)+(\\.\\w+)*@(\\w)+((\\.\\w+)+)$','请输入正确格式的E-Mail',1);
        } else if($active.hasClass('userName')){
            Forms.blur($active,'^[A-Za-z0-9\u4e00-\u9fa5]+$' ,'请输入字母或数字或中文',5,25)
        } else if($active.hasClass('userPassword')){
            Forms.blur($active,'^\\w+$' ,'6-16个字符的字母加数字或下划线组合',6,16);
        } else{
            Forms.blur($active,'','此项为必填项',1);
        }
    }
}();
