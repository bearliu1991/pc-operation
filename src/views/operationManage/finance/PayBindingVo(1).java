package com.qihuo.paycenter.api.vo;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

import java.io.Serializable;
import java.util.Date;

/**
* @描述: 支付绑定
*
* @Author:  sunking
* @Date:    2019/2/13 下午6:56
*/
@Data
public class PayBindingVo implements Serializable {

    private Integer id;

    private Integer userId;

    @NotBlank
    private String account; //支付账号：银行卡号／支付宝账户/微信 openId
    private String bankName; //银行名称／支付宝／微信

    private String idCardNo; //身份证号
    @NotBlank
    private String realName; //支付账号对应的名字：真实姓名
    // 支付账号对应的手机号
    private String mobile;

    // 支付方式 wx，微信；zfb,支付宝；bank，银行卡
    private String type;

    // 头像
    private String head;

    private Date createTime;

}
