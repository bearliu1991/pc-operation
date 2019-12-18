package com.qihuo.paycenter.api.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * @描述: 提现
 * @Author: sunking
 * @Date: 2019/3/19 上午9:55
 */
@Data
public class WithdrawVo implements Serializable {
    /**
     * id
     */
    private Long id;

    /**
     * 单据号, 订单id
     */
    private String orderCode;
    /**
     * 银行、支付宝、微信 账号
     */
    private String account;
    /**
     * 提现类型：bank, zfb, wx
     */
    private String type;
    /**
     * 金额
     */
    private Double amount;
    /**
     * 手续费
     */
    private Double serviceCharge;

    /**
     * 状态:
     *      "SUBMIT"; //申请提交
     *      "PASS"; //审核通过
     *      "RETREAT"; //驳回
     *      "SUCCESS"; //提现成功
     *      "FAIL"; //提现失败
     */
    private String status;
    /**
     * 状态对应的中文
     */
    private String statusValue;
    /**
     * 提现描述
     */
    private String desc;

    /**
     * 档口id
     */
    private Integer stallId;

    /**
     * 提现用户id
     */
    private Integer userId;

    // 提现用户类型 'stall' 档口， 'buyer' 采购商
    private String userType;
    /**
     * 申请时间
     */
    private Date createTime;
    /**
     * 修改时间
     */
    private Date modifyTime;

    // 支付密码（申请时用）
    private String payPwd;

    // 运营操作备注
    private String operateDesc;

    // 驳回标题
    private String retreatTitle;

    // 驳回描述
    private String retreatDesc;

}
