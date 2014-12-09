verifyForm
==========

表单验证

    使用方法：
        引入forms.js
        在需要填写验证的标签添加class名就可以了
            如：<input type="text">
                首先必须添加 mustFill 名，为必填项，如是email验证，再加 email 名
                <input class="mustFill email" type="text">

                目前写了5种验证类型，
                    用户名验证： userName
                    密码验证： userPassword
                    E-Mail验证： email
                    身份证验证： idCard
                    数字验证： number

    可扩展
        如果想添加别的验证可在 beginFill（）方法里添加，
        Forms.blur（）有4个参数，分别为 选择器，正则表达式，提示字，最小个数，最大个数
