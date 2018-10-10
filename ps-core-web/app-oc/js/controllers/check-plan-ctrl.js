define(['controllers/controllers', 'bootstrap-dialog'], function(controllers, BootstrapDialog) {
  'use strict';
  //点检计划
  controllers.initController('checkPlanCtrl', ['$scope','maintenanceTaskUIService','sparePartUIService','viewFlexService', 'faultKnowledgeUIService', 'resourceUIService', '$q', 'dictionaryService', 'unitService', 'customerUIService', 'projectUIService', 'userDomainService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl',
    function($scope,maintenanceTaskUIService,sparePartUIService,viewFlexService, faultKnowledgeUIService, resourceUIService, $q, dictionaryService, unitService, customerUIService, projectUIService, userDomainService, ngDialog, $location, $routeParams, $timeout, userLoginUIService, Info, growl) {

      var deferList = []; //用于执行顺序
      $scope.checkPlanLists = []; //点检计划列表列表
      $scope.abled = false;//启用
      $scope.unabled = false;//停用
      $scope.showView = false;
      $scope.addItemNumLists = []; //存储新增项次列表，用于添加
      $scope.Showitem = false; //输入框开关
      $scope.btnShowitem = false; //按钮开关

      $scope.selectedDitem = {
          "types": [], //存储所有设备模板
          "label": [], //存储所有设备
          "customerList": [], //客户展示信息
          "projectLists": [] //项目级联信息
      };

        /**
         * 对象初始化
         */

        function initAddList() {

            //点检计划
            $scope.checkplanAddData = {
                "domainPath":"",//数据域
                "planNumber": "",//点检计划编号
                "projectName": "",//点检项目名称
                "checkAreaId": "",//点检区域id
                "checkAreaName": "",//点检区域名称
                "periodicUnitName": "",//周期单位名称
                "periodicInterval": "",//周期间隔
                "startDate": "",//开始日期
                "startTime": "",//开始时间
                "planStatus": "1",//是否启用，默认关闭状态
                "pointCheckLists": []//点检项次
            };

            //查询
            $scope.queryDitem = {
                "domainPath":"",//数据域
                "factoryId":"",//厂站id
                "factoryName":"",//厂站名称
                "workshopId":"",//车间id
                "workshopName": "",//车间名称
                "checkAreaId": "",//线体id
                "checkAreaName": "",//线体名称
                "projectName": ""//点检计划名称
            };

        }



        //tab切换
        $scope.queryState = 1;
        $scope.planListInfo = function() {

            if($scope.queryState == 1){
                location.href = "#/prod_checkPlan";

            }else if($scope.queryState == 2){
                location.href = "#/prod_maintainPlan";
            }
        };


      /**
       * 查询厂部
       */
      $scope.customersList={};
      $scope.customersDic = {};
      var queryCustomer = function() {
          customerUIService.findCustomersByCondition({}, function(returnObj) {
              $scope.customersDic = returnObj.customerDic;
              returnObj.data.forEach(function(item) {
                  item.text = item.customerName;
              })
              $scope.customersList = returnObj.data;
          })
      };

      /**
       * 查询车间
       */
      $scope.projectsList;
      $scope.projectsDic = {};
      $scope.queryProject = function(reflash) {
          projectUIService.findProjectsByCondition({}, function(returnObj) {
              if(returnObj.code == 0) {
                  returnObj.data.forEach(function(item) {
                      $scope.projectsDic[item.id] = item;
                      item.text = item.projectName;
                  })
                  $scope.projectsList = returnObj.data;
                  if(reflash)
                      growl.success("操作成功！");

              }
          })
      };



        //模糊查询备件信息
        $scope.goSearch = function () {
            var serarch = {};
            if($scope.queryDitem.factoryId){
                serarch["factoryId"] = $scope.queryDitem.factoryId;
            };
            if($scope.queryDitem.workshopId){
                serarch["workshopId"] = $scope.queryDitem.workshopId;
            };
            if($scope.queryDitem.checkAreaId){
                serarch["checkAreaId"] = $scope.queryDitem.checkAreaId;
            };
            if($scope.queryDitem.projectName){
                serarch["projectName"] = $scope.queryDitem.projectName;
            };
            queryData(serarch);
        };

        /**
         *  查询列表
         */
        var queryData = function(queryObj) {
            sparePartUIService.findSparePartsByCondition(queryObj, function(resultObj) {
                if(resultObj.code == 0) {

                    $scope.spareInfoList = resultObj.data;
                    $scope.$broadcast(Event.ALERTRULESINIT + "_check", {
                        'option': [$scope.spareInfoList]
                    });
                }
            });
        };



        //添加点检计划
        $scope.addCheckPlan = function(obj){

            $scope.showView = false;
            if(obj == 0){
                initAddList();
            }else{
                $scope.checkplanAddData = obj;
                $scope.checkplanAddData.id = obj.id
            }

            ngDialog.open({
                template: '../partials/dialogue/add_check_plan.html',
                scope: $scope,
                className: 'ngdialog-theme-plain'
            });
            //新增项次模拟数据
            $timeout(function() {
                $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                    'option': [[]]//$scope.checkPlanLists
                });
            },50)
        };


        //保存点检计划
        $scope.saveCheckPlan=function(obj){
            var param = {
                "domainPath": $scope.checkplanAddData.domainPath,//数据域
                "planNumber": $scope.checkplanAddData.planNumber,//点检计划编号
                "projectName": $scope.checkplanAddData.projectName,//点检计划名称
                "checkAreaId": $scope.checkplanAddData.checkAreaId,//点检区域
                "checkAreaName": $scope.checkplanAddData.checkAreaName,//点检区域名称
                "periodicUnitName": $scope.checkplanAddData.periodicUnitName,//周期单位名称
                "periodicInterval": $scope.checkplanAddData.periodicInterval,//周期间隔
                "startDate": $scope.checkplanAddData.startDate,//开始日期
                "startTime": $scope.checkplanAddData.startTime, //开始时间
                "planStatus": $scope.checkplanAddData.planStatus,//是否启用
                "id": $scope.checkplanAddData.id,
                "pointCheckLists": $scope.addItemNumLists//点检项次
            };

            if($scope.inspectStandard.id > 0){
                alert("修改");
                maintenanceTaskUIService.updateMaintenanceTask($scope.inspectStandard, function(returnObj) {
                    if(returnObj.code == 0) {
                        $scope.closeDialog();
                        growl.success("点检计划修改成功", {});
                        getAllCheckPlan({});
                    }
                });
            }else{
                alert("添加");
                maintenanceTaskUIService.updateMaintenanceTask(param, function(returnObj) {
                    alert(456);
                    if(returnObj.code == 0) {
                        $scope.closeDialog();
                        $scope.InsStandardItem = returnObj.data;
                        growl.success("添加点检计划成功", {});
                        getAllCheckPlan({});
                    }
                });
            }

        };


        //启用、停用
        $scope.selectTaskList = [];
        $scope.selectStatusList = {"startList":[],"disableList":[]};
        $scope.selectedHandler = function () {
            var activeAlert = [];
            $scope.selectStatusList.startList = [];
            $scope.selectStatusList.disableList = [];
            // console.log(JSON.stringify(columsData));
            $scope.taskList.forEach(function(obj) {
                if(obj.selected) {
                    activeAlert.push(obj);
                    if(obj.taskStatus == 0){
                        $scope.selectStatusList.startList.push(obj);
                    }else if(obj.taskStatus == 1){
                        $scope.selectStatusList.disableList.push(obj);
                    }
                }
            });
            $scope.selectTaskList = activeAlert;
            $scope.$apply();
        };

        //启用、停用
        $scope.checkPlanStatus = function(status){
            var selTask = [];
            for(var b in $scope.selectTaskList){
                if($scope.selectTaskList[b].taskStatus != status){
                    selTask.push($scope.selectTaskList[b].id);
                }
            }
            var str = '';
            if (status == 0) {

                str += '启用';
            } else if (status == 1) {

                str += '停用';
            }
            if(selTask.length > 0){
                BootstrapDialog.show({
                    title: '提示',
                    closable: false,
                    message: '确认'+str+'这' + selTask.length + '个计划吗？',
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn-success',
                        action: function(dialogRef) {
                            resourceUIService.modifyStatus([selTask,status], function(returnObj) {
                                if(returnObj.code == 0) {
                                    for(var i in $scope.taskList) {
                                        returnObj.data.successObj.forEach(function(gate){
                                            if($scope.taskList[i].id == gate) {
                                                $scope.taskList[i].taskStatus = status;;
                                                return true;
                                            }
                                        });
                                        $scope.taskList[i].selected = false;
                                    }
                                    $scope.selectTaskList = [];
                                    $scope.selectStatusList.disableList = [];
                                    $scope.selectStatusList.startList = [];

                                    $scope.$broadcast("MAINTENANCE", {
                                        data: $scope.taskList
                                    });
                                    growl.success(""+str+"成功"+returnObj.data.successObj.length+"个计划,失败"+returnObj.data.failObj.length+"个计划", {});
                                }
                            });
                            dialogRef.close();
                        }
                    }, {
                        label: '取消',
                        action: function(dialogRef) {
                            dialogRef.close();
                        }
                    }]
                });
            }else {
                growl.warning("没有要"+str+"的检点计划",{})
            }
        }



        //新增点检项次
        var getaddCheckNumberList = function(item) {

            $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                "option": [item]
            });
        };


        //新增项次
        $scope.addCheckNumber = function() {
            $scope.Showitem = true;

            if(jQuery("#contectcollapse").find(".fa.fa-plus").length > 0) {
                jQuery.AdminLTE.boxWidget.collapse(jQuery("#contectcollapse"));
            }
            for(var i in $scope.addItemNumLists) {
                if($scope.addItemNumLists[i].id == 0 && $scope.addItemNumLists[i].isEdit == 2) { //新加跳转第一项
                    $scope.selCustomor = {"id":""}; //在table中的数据清空
                    $scope.selTableProjectId = ''; //在table中的数据清空
                    getaddCheckNumberList($scope.addItemNumLists);
                    return;
                } else if($scope.addItemNumLists[i].id != 0 && $scope.addItemNumLists[i].isEdit == 2) { //编辑原地不动
                    growl.warning("已存在正在编辑的新增项次", {});
                    return;
                }
            }
            var newObj = {
                'itemId': "" ,//项次
                'equipmentId': "",//设备id
                'equipmentName': "",//设备名称
                'checkMessage':  "",//点检内容
                'checkStandard': "" ,//点检标准
                'checkTool': "",//点检工具
                'checkMethod': "",//点检方法
                'isEdit': "2",//操作input条件
                'id':""
            };


            $scope.addItemNumLists.unshift(newObj);
            getaddCheckNumberList($scope.addItemNumLists);
        };



        //获取所有点检计划
        var getAllCheckPlan = function() {

            sparePartUIService.getAllSpareParts(function(returnObj) {
                if (returnObj.code == 0) {
                    $scope.checkPlanLists = returnObj.data;
                    $scope.checkPlanLists = [];
                    $scope.spareInfos = [];
                    for (var i in returnObj.data) {
                        var obj = returnObj.data[i];
                        obj.isEdit = 0;
                        $scope.checkPlanLists.push(obj);
                    }
                    $scope.$broadcast(Event.ALERTRULESINIT + "_check", {
                        "option": [$scope.checkPlanLists]
                    });
                }
            })
        };




        /**
         * 处理点检项次table
         */
        $scope.doAction = function(type, select, callback) {

            if(type == "delectCheckPlan"){

                BootstrapDialog.show({
                    title: '提示',
                    closable: false,
                    message: '确认删除此条点检计划吗？',
                    buttons: [{
                        label: '确定',
                        cssClass: 'btn-success',
                        action: function(dialogRef) {

                            resourceUIService.deleteInspectionItemById(select.id, function(returnObj) {
                                if(returnObj.code == 0) {
                                    growl.success("成功删除点检计划", {});
                                    getAllCheckPlan({});
                                }

                            });
                            dialogRef.close();
                        }
                    }, {
                        label: '取消',
                        action: function(dialogRef) {
                            dialogRef.close();
                        }
                    }]
                });

            }else if(type == "cancelCheckNumber") {

                for(var i = $scope.addItemNumLists.length - 1; i > -1; i--) {
                    if($scope.addItemNumLists[i].id == 0) {
                        $scope.addItemNumLists.splice(i, 1);
                    } else {
                        $scope.addItemNumLists[i]["isEdit"] = 0;
                    }
                }
                $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                    "option": [$scope.addItemNumLists]
                });

            } else if(type == "saveCheckNumber") {

                if(select != "" && select != null) {
                    callback(select);
                    return;
                }
            } else if(type == "deleteCheckNumber") {

                filterBlankOrDelete($scope.addItemNumLists, select.id);
                $scope.$broadcast(Event.ALERTRULESINIT + "_item", {
                    "option": [$scope.addItemNumLists]
                });

            }
        };


        //过滤由于添加信息后未删除的空项 || 删除与id相同的项
        function filterBlankOrDelete(obj, id) {
            for(var i in obj) {
                if(id) {
                    if(obj[i].id == id) {
                        obj.splice(i, 1);
                    }
                } else {
                    if(obj[i].id == 0) {
                        obj.splice(i, 1);
                    }
                }
            }
        };

        //通过项次过滤点检项次列表
        // $scope.getselectedCheck = function(itemId) {
        //     $scope.selectedDitem.projectLists = [];
        //     var arr = [];
        //     if(!itemId) {
        //         return;
        //     } else {
        //         for(var i in $scope.projectLists) {
        //             var projectObj = $scope.projectLists[i];
        //             if(projectObj.itemId == itemId) {
        //                 arr.push(projectObj);
        //             }
        //         }
        //         if(!$scope.checknumAddData.itemId) {
        //             return arr;
        //         } else {
        //             $scope.selectedDitem.projectLists = arr;
        //         }
        //     }
        // };



      function init() {
        initAddList();//初始化列表项
        $scope.queryProject();//初始化车间
        queryCustomer();//初始化厂部
        getAllCheckPlan();//初始化表格

      };

      if(!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function(evt, d) {
          if(userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);

  //保养计划
  controllers.initController('maintainPlanCtrl', ['$scope','sparePartUIService','viewFlexService', 'faultKnowledgeUIService', 'resourceUIService', '$q', 'dictionaryService', 'unitService', 'customerUIService', 'projectUIService', 'userDomainService', 'ngDialog', '$location', '$routeParams', '$timeout', 'userLoginUIService', 'Info', 'growl',
        function($scope,sparePartUIService,viewFlexService, faultKnowledgeUIService, resourceUIService, $q, dictionaryService, unitService, customerUIService, projectUIService, userDomainService, ngDialog, $location, $routeParams, $timeout, userLoginUIService, Info, growl) {

            var deferList = []; //用于执行顺序
            $scope.maintainPlanLists = []; //保养计划列表列表
            $scope.abled = false;//启用
            $scope.unabled = false;//停用
            $scope.showView = false;
            $scope.addMaintainNumLists = []; //存储新增保养项次列表，用于添加
            $scope.Showitem = false; //输入框开关
            $scope.btnShowitem = false; //按钮开关

            $scope.selectedDitem = {
                "types": [], //存储所有设备模板
                "label": [], //存储所有设备
                "customerList": [], //客户展示信息
                "projectLists": [] //项目级联信息
            };

            /**
             * 对象初始化
             */

            function initAddList() {

                //保养计划
                $scope.maintainplanAddData = {
                    "domainPath":"",//数据域
                    "maintenancePlanNumber":"",//保养计划编号
                    "projectName":"",//保养项目名称
                    "equipmentId":"",//保养设备id
                    "equipmentName":"",//保养设备名称
                    "periodicUnitName":"",//周期单位名称
                    "periodicInterval":"",//周期间隔
                    "startDate": "",//开始日期
                    "startTime": "",//开始时间
                    "maintenanceUnitId": "",//保养类型id
                    "maintenanceName": "",//保养类型名称
                    "planStatus": "",//是否启用，默认关闭状态
                    "maintenanceTerms": []//保养项次
                };

                //查询
                $scope.queryDitem = {
                    "domainPath":"",//数据域
                    "factoryId":"",//厂站id
                    "factoryName":"",//厂站名称
                    "workshopId":"",//车间id
                    "workshopName": "",//车间名称
                    "checkAreaId": "",//线体id
                    "checkAreaName": "",//线体名称
                    "maintainName": ""//保养计划名称
                };

            }



            //tab切换
            $scope.queryState = 2;
            $scope.planListInfo = function() {

                if($scope.queryState == 1){
                    location.href = "#/prod_checkPlan";

                }else if($scope.queryState == 2){
                    location.href = "#/prod_maintainPlan";
                }
            };


            /**
             * 查询厂部
             */
            $scope.customersList={};
            $scope.customersDic = {};
            var queryCustomer = function() {
                customerUIService.findCustomersByCondition({}, function(returnObj) {
                    $scope.customersDic = returnObj.customerDic;
                    returnObj.data.forEach(function(item) {
                        item.text = item.customerName;
                    })
                    $scope.customersList = returnObj.data;
                })
            };

            /**
             * 查询车间
             */
            $scope.projectsList;
            $scope.projectsDic = {};
            $scope.queryProject = function(reflash) {
                projectUIService.findProjectsByCondition({}, function(returnObj) {
                    if(returnObj.code == 0) {
                        returnObj.data.forEach(function(item) {
                            $scope.projectsDic[item.id] = item;
                            item.text = item.projectName;
                        })
                        $scope.projectsList = returnObj.data;
                        if(reflash)
                            growl.success("操作成功！");

                    }
                })
            };



            //模糊查询备件信息
            $scope.goSearch = function () {
                var serarch = {};
                if($scope.queryDitem.factoryId){
                    serarch["factoryId"] = $scope.queryDitem.factoryId;
                };
                if($scope.queryDitem.workshopId){
                    serarch["workshopId"] = $scope.queryDitem.workshopId;
                };
                if($scope.queryDitem.checkAreaId){
                    serarch["checkAreaId"] = $scope.queryDitem.checkAreaId;
                };
                if($scope.queryDitem.projectName){
                    serarch["projectName"] = $scope.queryDitem.projectName;
                };
                queryData(serarch);
            };

            /**
             *  查询列表
             */
            var queryData = function(queryObj) {
                sparePartUIService.findSparePartsByCondition(queryObj, function(resultObj) {
                    if(resultObj.code == 0) {

                        $scope.spareInfoList = resultObj.data;
                        $scope.$broadcast(Event.ALERTRULESINIT + "_maintain", {
                            'option': [$scope.spareInfoList]
                        });
                    }
                });
            };



            //添加保养计划
            $scope.addMaintainPlan = function(obj){
                $scope.showView = false;
                if(obj == 0){
                    initAddList();
                }else{
                    $scope.maintainplanAddData = obj;
                    $scope.maintainplanAddData.id = obj.id
                }

                ngDialog.open({
                    template: '../partials/dialogue/add_maintain_plan.html',
                    scope: $scope,
                    className: 'ngdialog-theme-plain'
                });
                //新增保养项次模拟数据
                $timeout(function() {
                    $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                        'option': [[]]//$scope.maintainPlanLists
                    });
                },50)
            };


            //保存保养计划
            $scope.saveMaintainPlan=function(obj){

                var param = {

                    "domainPath": $scope.maintainplanAddData.domainPath,
                    "maintenancePlanNumber": $scope.maintainplanAddData.maintenancePlanNumber,//保养计划编号
                    "projectName": $scope.maintainplanAddData.projectName,//保养项目名称
                    "equipmentId": $scope.maintainplanAddData.equipmentId,//保养设备id
                    "equipmentName": $scope.maintainplanAddData.equipmentName,//保养设备名称
                    "periodicUnitName": $scope.maintainplanAddData.periodicUnitName,//周期单位名称
                    "periodicInterval": $scope.maintainplanAddData.periodicInterval,//周期间隔
                    "startDate": $scope.maintainplanAddData.startDate,//开始日期
                    "startTime": $scope.maintainplanAddData.startTime,//开始时间
                    "maintenanceUnitId": $scope.maintainplanAddData.maintenanceUnitId,//保养类型id
                    "maintenanceName": $scope.maintainplanAddData.maintenanceName,//保养类型名称
                    "planStatus": $scope.maintainplanAddData.planStatus,//是否启用，默认关闭状态
                    "maintenanceTerms": $scope.addMaintainNumLists//保养项次

                };

                if($scope.inspectStandard.id > 0){
                    alert(修改);
                    sparePartUIService.updateInspectionItem($scope.inspectStandard, function(returnObj) {
                        if(returnObj.code == 0) {
                            $scope.closeDialog();
                            growl.success("保养计划修改成功", {});
                            getAllMaintainPlan({});
                        }
                    });
                }else{
                    alert(添加);
                    sparePartUIService.addInspectionItem(param, function(returnObj) {
                        if(returnObj.code == 0) {
                            $scope.closeDialog();
                            $scope.InsStandardItem = returnObj.data;
                            growl.success("添加保养计划成功", {});
                            getAllMaintainPlan({});
                        }
                    });
                }

            };

            //启用停用
            $scope.checkPlanStatus = function(status){
                var selTask = [];
                for(var b in $scope.selectTaskList){
                    if($scope.selectTaskList[b].taskStatus != status){
                        selTask.push($scope.selectTaskList[b].id);
                    }
                }
                var str = '';
                if (status == 0) {

                    str += '启用';
                } else if (status == 1) {

                    str += '停用';
                }
                if(selTask.length > 0){
                    BootstrapDialog.show({
                        title: '提示',
                        closable: false,
                        message: '确认'+str+'这' + selTask.length + '个计划吗？',
                        buttons: [{
                            label: '确定',
                            cssClass: 'btn-success',
                            action: function(dialogRef) {
                                resourceUIService.modifyStatus([selTask,status], function(returnObj) {
                                    if(returnObj.code == 0) {
                                        for(var i in $scope.taskList) {
                                            returnObj.data.successObj.forEach(function(gate){
                                                if($scope.taskList[i].id == gate) {
                                                    $scope.taskList[i].taskStatus = status;;
                                                    return true;
                                                }
                                            });
                                            $scope.taskList[i].selected = false;
                                        }
                                        $scope.selectTaskList = [];
                                        $scope.selectStatusList.disableList = [];
                                        $scope.selectStatusList.startList = [];

                                        $scope.$broadcast("MAINTENANCE", {
                                            data: $scope.taskList
                                        });
                                        growl.success(""+str+"成功"+returnObj.data.successObj.length+"个计划,失败"+returnObj.data.failObj.length+"个计划", {});
                                    }
                                });
                                dialogRef.close();
                            }
                        }, {
                            label: '取消',
                            action: function(dialogRef) {
                                dialogRef.close();
                            }
                        }]
                    });
                }else {
                    growl.warning("没有要"+str+"的保养计划",{})
                }
            }


            //新增保养项次
            var getaddMaintainNumberList = function(item) {

                $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                    "option": [item]
                });
            };


            //新增保养项次
            $scope.addMaintainNumber = function() {

                if(jQuery("#contectcollapse").find(".fa.fa-plus").length > 0) {
                    jQuery.AdminLTE.boxWidget.collapse(jQuery("#contectcollapse"));
                }
                for(var i in $scope.addMaintainNumLists) {
                    if($scope.addMaintainNumLists[i].id == 0 && $scope.addMaintainNumLists[i].isEdit == 2) { //新加跳转第一项
                        $scope.selCustomor = {"id":""}; //在table中的数据清空
                        $scope.selTableProjectId = ''; //在table中的数据清空
                        getaddMaintainNumberList($scope.addMaintainNumLists);
                        return;
                    } else if($scope.addMaintainNumLists[i].id != 0 && $scope.addMaintainNumLists[i].isEdit == 2) { //编辑原地不动
                        growl.warning("已存在正在编辑的新增项次", {});
                        return;
                    }
                }
                $scope.Showitem = true;
                var newObj = {
                    'itemId': "" ,//项次
                    'maintenance': "",//保养内容
                    'maintenanceStandard': "" ,//保养标准
                    'maintenanceTool': "",//保养工具
                    'inspectionMode': "",//检查方法
                    'isEdit': "2",//操作input条件
                    'id':""
                };


                $scope.addMaintainNumLists.unshift(newObj);
                getaddMaintainNumberList($scope.addMaintainNumLists);
            };



            //获取所有保养计划
            var getAllMaintainPlan = function() {

                sparePartUIService.getAllSpareParts(function(returnObj) {
                    if (returnObj.code == 0) {
                        $scope.maintainPlanLists = returnObj.data;
                        $scope.maintainPlanLists = [];
                        $scope.spareInfos = [];
                        for (var i in returnObj.data) {
                            var obj = returnObj.data[i];
                            obj.isEdit = 0;
                            $scope.maintainPlanLists.push(obj);
                        }
                        $scope.$broadcast(Event.ALERTRULESINIT + "_maintainPlan", {
                            "option": [$scope.maintainPlanLists]
                        });
                    }
                })
            };




            /**
             * 处理保养项次table
             */
            $scope.doAction = function(type, select, callback) {

                if(type == "delectMaintainPlan"){

                    BootstrapDialog.show({
                        title: '提示',
                        closable: false,
                        message: '确认删除此条保养计划吗？',
                        buttons: [{
                            label: '确定',
                            cssClass: 'btn-success',
                            action: function(dialogRef) {

                                resourceUIService.deleteInspectionItemById(select.id, function(returnObj) {
                                    if(returnObj.code == 0) {
                                        growl.success("成功删除保养计划", {});
                                        getAllMaintainPlan({});
                                    }

                                });
                                dialogRef.close();
                            }
                        }, {
                            label: '取消',
                            action: function(dialogRef) {
                                dialogRef.close();
                            }
                        }]
                    });

                }else if(type == "cancelMaintainNumber") {

                    for(var i = $scope.addMaintainNumLists.length - 1; i > -1; i--) {
                        if($scope.addMaintainNumLists[i].id == 0) {
                            $scope.addMaintainNumLists.splice(i, 1);
                        } else {
                            $scope.addMaintainNumLists[i]["isEdit"] = 0;
                        }
                    }
                    $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                        "option": [$scope.addMaintainNumLists]
                    });

                } else if(type == "saveMaintainNumber") {

                    if(select != "" && select != null) {
                        callback(select);
                        return;
                    }
                } else if(type == "deleteMaintainNumber") {

                    filterBlankOrDelete($scope.addMaintainNumLists, select.id);
                    $scope.$broadcast(Event.ALERTRULESINIT + "_maintainItem", {
                        "option": [$scope.addMaintainNumLists]
                    });

                }
            };


            //过滤由于添加信息后未删除的空项 || 删除与id相同的项
            function filterBlankOrDelete(obj, id) {
                for(var i in obj) {
                    if(id) {
                        if(obj[i].id == id) {
                            obj.splice(i, 1);
                        }
                    } else {
                        if(obj[i].id == 0) {
                            obj.splice(i, 1);
                        }
                    }
                }
            };


            function init() {
                initAddList();//初始化列表项
                $scope.queryProject();//初始化车间
                queryCustomer();//初始化厂部
                getAllMaintainPlan();//初始化表格

            };

            if(!userLoginUIService.user.isAuthenticated) {
                $scope.$on('loginStatusChanged', function(evt, d) {
                    if(userLoginUIService.user.isAuthenticated) {
                        init();
                    }
                });
            } else {
                init();
            }
        }
    ]);

});