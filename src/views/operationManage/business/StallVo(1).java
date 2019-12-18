package com.qihuo.usercenter.api.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @Author : caideli
 * @Email : 1595252552@qq.com
 * @Date : 2019/1/10 10:39
 * TODO
 */
@Data
public class StallVo implements Serializable {
    private Integer id;//主键id
    private Integer userId;//档口所属的userId
    private String phone;
    private String code;//编号A008
    private Integer status;//状态，1：启动，0：停业 ,2 待审核 3,禁用

    private Integer buildingId;//所在大楼ID
    private String buildingName;
    private Integer floorId;
    private String floorName;//所在楼层

    private Integer marketId;//所属的市场
    private String name;//档口名称
    /**
     * 省
     */
    private String provinceId;

    /**
     * 市
     */
    private String cityId;

    /**
     * 区
     */
    private String areaId;
    private String location;//公司位置
    private String betterAddress;//详细地址
    private String mallImage;//小程序商城的店铺头像
    private String businessScopeCode;//经营类目(主营业务)
    private String businessHours;//门店营业时间
    private String businessLicense;//商家营业执照
    private String machineCode;//机器码

    private Date updateTime;//修改人时间
    private String shopPicPath;//商家门店照片

    private List<DeviceStallVo> deviceList;

    private StallBuildingVo building;
}