package com.qihuo.paycenter.api.vo;

import lombok.Data;

import java.io.Serializable;

/**
* @描述: 提现配置
*
* @Author:  sunking
* @Date:    2019/3/28 上午9:43
*/
@Data
public class WithdrawConfigVo implements Serializable {

    private Integer id;

    private Double platformDailyMax; //平台当日最大提现额度：
    private double channelPlatformDailyMax; //渠道当日最大提现额度：


    private Double personalSingleMax; //平台个人单笔最大提现额度:
    private double channelPersonalSingleMax; //渠道个人单笔最大提现额度:

    // 个人单笔最小提现额度:
    private Double personalSingleMin;
    private double channelPersonalSingleMin;

    // 个人当日最多提现次数:
    private int personalDailyTimes;

    // 手续费费率设置:
    private Double serviceChargeRate;
    private double channelServiceChargeRate;

    // 最小手续费:
    private Double serviceChargeMin;
    private double channelServiceChargeMin;

    // 最大手续费:
    private Double serviceChargeMax;
    private double channelServiceChargeMax;

    // 渠道： wx,zfb,bank
    private String channel;

    // 提现用户类型 'stall' 档口， 'buyer' 采购商
    private String userType;

    //提现通道状态 1. '开启中'； 2.  ‘自动关闭-余额不足’ 3. ‘手动关闭’
    private int status;

    // 剩余提现次数
    private int remainingTimes;

}
