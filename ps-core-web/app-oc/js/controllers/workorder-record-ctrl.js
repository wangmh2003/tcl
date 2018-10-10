define(['controllers/controllers', 'bootstrap-dialog'], function (controllers, BootstrapDialog) {
  'use strict';
  controllers.initController('WorkOrderRecordCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', 'growl', 'userLoginUIService', 'userEnterpriseService', 'Info', '$route', 'ticketTaskService', 'ticketCategoryService',
    function ($scope, $rootScope, $location, $routeParams, $timeout, growl, userLoginUIService, userEnterpriseService, Info, $route, ticketTaskService, ticketCategoryService) {
      console.log('进入工单任务');
      $scope.processType = {};
      $scope.activeListTab = "tab1";
      //工单计数
      $scope.ordercount = {
        "notdeal": 0,
        "dealing": 0,
        "done": 0
      }

      //获取工单流程定义
      function getProcessDefinitions() {
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              $scope.processType[returnObj.data[i].workflowId] = returnObj.data[i];
            }
          }
        });
      };
      //格式化时间
      var formatDate = function (str) {
        if (str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      }
      $scope.herfList = function (name, data, state) {//state == 是工单任务的三种状态（待处理，处理中，已完成）
        $rootScope.dataList = data;
        if (data != undefined && data.ticketNo != null) {
          if (data.templateURL != "" && data.templateURL != undefined && data.templateURL != null) {
            var url = $.trim(data.templateURL);// + "/" + data.id;
            var fullUrl = url.split('?');
            if (fullUrl[1]) {
              url = fullUrl[0] + "/" + data.id + '?' + fullUrl[1];
            } else {
              url = $.trim(data.templateURL) + "/" + data.id;
            }
            location.href = url;
          } else {
            location.href = "index.html#/orderdetail/" + data.id + "/task";
          }
          //location.href = "index.html#/orderdetail/" + data.id + "/task"+"/"+state;
          //location.href = "../app-flowsheet/index.html#/processView/" + data.id ;
        }
      };
      /**
       * 获取任务数量
       *
       */
      $scope.getRecordCount = function () {
        ticketTaskService.getTicketTasksByStatus(10, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.ordercount.notdeal = returnObj.data.length;
          }
        });
        ticketTaskService.getTicketTasksByStatus(100, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.ordercount.dealing = returnObj.data.length;
          }
        });
        ticketTaskService.getTicketTasksByStatus(200, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.ordercount.done = returnObj.data.length;
          }
        });
      };
      //获取工单任务数据
      $scope.getRecordData = function (status) {
        // 10 - 待处理 100-处理中 200-已完成
        ticketTaskService.getTicketTasksByStatus(status, function (returnObj) {
          if (returnObj.code == 0) {
            var state = null;
            if (status == 10) {
              $scope.ordercount.notdeal = returnObj.data.length;
              state = "notdeal";//待处理
            } else if (status == 100) {
              $scope.ordercount.dealing = returnObj.data.length;
              state = "dealing";//处理中
            } else if (status == 200) {
              $scope.ordercount.done = returnObj.data.length;
              state = "done";//已完成
            }
            // statusTab(status);
            $scope.recordData = {
              "columns": [{
                "data": "ticketTitle",
                "title": "工单名称"
              }, {
                "data": "ticketNo",
                "title": "工单号"
              }, {
                "data": "processDefinitionId",
                "title": "工单流程"
              }, {
                "data": "taskConfigName",
                "title": "任务名称"
              }, {
                "data": "senderName",
                "title": "发送人"
              }, {
                "data": "sendTime",
                "title": "发送时间"
              }, {
                "data": "finishedTime",
                "title": "完成时间",
                "visible": false
              }, {
                "data": "option",
                "orderable": false,
                "width": "150px",
                "visible": $scope.menuitems['A01_S08'] != undefined,
                "title": "操作"
              }],
              "columnDefs": [{
                "targets": 0,
                "data": "ticketTitle",
                "render": function (data, type, full) {
                  return "<span style='cursor:pointer;'>" + data + "</span>";
                }
              }, {
                "targets": 1,
                "data": "ticketNo",
                "render": function (data, type, full) {
                  return "<span style='cursor:pointer;'>" + data + "</span>";
                }
              }, {
                "targets": 2,
                "data": "processDefinitionId",
                "render": function (data, type, full) {
                  var str = "";
                  if ($scope.processType && $scope.processType[data] != undefined) {
                    str = $scope.processType[data].name;
                  }
                  return "<span style='cursor:pointer;'>" + str + "</span>";
                }
              }, {
                "targets": 3,
                "data": "taskConfigName",
                "render": function (data, type, full) {
                  return "<span style='cursor:pointer;'>" + data + "</span>";
                }
              }, {
                "targets": 4,
                "data": "senderName",
                "render": function (data, type, full) {
                  return "<span style='cursor:pointer;'>" + data + "</span>";
                }
              }, {
                "targets": 5,
                "data": "sendTime",
                "render": function (data, type, full) {
                  //发送时间
                  return "<span style='cursor:pointer;'>" + useMomentFormat(data, "yyyy-MM-dd hh:mm:ss") + "</span>";
                }
              }, {
                "targets": 6,
                "data": "finishedTime",
                "render": function (data, type, full) {
                  //完成时间
                  return "<span style='cursor:pointer;'>" + useMomentFormat(data, "yyyy-MM-dd hh:mm:ss") + "</span>";
                }
              }, {
                "targets": 7,
                "data": "option",
                "render": function (data, type, full) {
                  var str = '';
                  var strName = "执行";
                  if (full.taskStatus == 200) {
                    strName = "查看";
                  }
                  str += "<button id='execute' class='btn btn-primary' style='cursor: pointer;' ><i class='fa fa-close hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>" + strName + "</span></button>";
                  if ($scope.menuitems['S08']) {
                    str += "<button id='process' class='btn btn-default' style='cursor: pointer;' ><i class='fa fa-close hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'>过程跟踪</span></button>";
                  }
                  return str;
                }
              }],
              data: []
            }
            var list = [];
            for (var i in returnObj.data) {
              if (returnObj.data[i].variables.theTicketType != 'bid' && returnObj.data[i].variables.theTicketType != 'allocated') {
                list.push(returnObj.data[i]);
              }
            }
            $scope.recordData.data = list;
            $scope.recordData.state = state;
            $scope.$broadcast(Event.WORKORDERRECORDINIT, $scope.recordData);
          }
        });
      }
      /*var statusTab = function(status){

        for (var i = $scope.recordData.columns.length - 1; i > -1; i--) {
          var item = $scope.recordData.columns[i]
          if (item.data == "finishedTime") {
            if(status == 200){
              item.visible = true;
              item.bVisible = true;
            }else{
              item.visible = false;
              item.bVisible = false;
            }
            $scope.recordData.columns[i] = item;
            break;
          }
        }
      }*/
      //监测Tab页的变换
      var previousTab;
      /*  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          // 获取已激活的标签页的名称
          $scope.activeTab = $(e.target).text();
          // 获取前一个激活的标签页的名称
          previousTab = $(e.relatedTarget).text();
          var state = null;
          if ($scope.activeTab.indexOf('待处理') > -1) {
            state = 10;
          } else if ($scope.activeTab.indexOf('处理中') > -1) {
            state = 100;
          } else if ($scope.activeTab.indexOf('已完成') > -1) {
            state = 200;
          }
          $scope.getRecordData(state);
        });*/
      /**
       * tab页的事件监听
       */
      var initEvent = function () {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          if ($(e.target).closest("li.disabled").length > 0) {
            $(e.target).closest("li.disabled").removeClass("active");
            $(e.target).closest("ul").children("[name=" + $scope.activeListTab + "]").addClass("active");
            return;
          }
          var aname = $(e.target).closest("li").attr("name");
          if (aname) {
            $scope.activeListTab = aname;
            $scope.$apply();
            // 获取已激活的标签页的名称
            $scope.activeTab = $(e.target).text();
            var state = null;
            if (aname == 'tab1') {
              state = 10;
            } else if (aname == 'tab2') {
              state = 100;
            } else if (aname == 'tab3') {
              state = 200;
            }
            $scope.getRecordData(state);
          }
        });
      }

      //初始化数据
      function init() {
        initEvent();
        getProcessDefinitions();
        $scope.getRecordCount();
        if ($routeParams && $routeParams.state) {
          var id = null;
          var state = null;
          switch ($routeParams.state) {
            case 'notdeal':
              id = 0;
              state = 10;
              break;
            case 'dealing':
              id = 1;
              state = 100;
              break;
            case 'done':
              id = 2;
              state = 200;
              break;
          }
          $("#myTab li:eq(" + id + ") a").tab('show');
          $scope.getRecordData(state);
        } else {
          $scope.getRecordData(10);
          // $scope.getRecordData(100);
          // $scope.getRecordData(200);
        }
      }

      init();
    }
  ]);
  /**
   * 工单详情，同时也可以直接处理任务，如果不是模板任务的时候
   */
  controllers.initController('orderDetailCtrl', ['$scope', '$q', '$controller', '$rootScope', '$location', '$routeParams', '$timeout', 'growl', 'resourceUIService', 'workflowService', 'faultKnowledgeUIService', 'userEnterpriseService', 'Info', '$route', 'ticketTaskService', 'ticketCategoryService', 'userLoginUIService', 'customerUIService', 'projectUIService', 'userUIService', 'FileUploader', 'configUIService', 'sparePartUIService',
    function ($scope, $q, $controller, $rootScope, $location, $routeParams, $timeout, growl, resourceUIService, workflowService, faultKnowledgeUIService, userEnterpriseService, Info, $route, ticketTaskService, ticketCategoryService, userLoginUIService, customerUIService, projectUIService, userUIService, FileUploader, configUIService, sparePartUIService) {
      var id = $routeParams.id;
      var uploader = $scope.uploader = new FileUploader({
        url: '' + userUIService.uploadFileUrl + '/api/rest/upload/resourceFileUIService/uploadResourceFile',
        withCredentials: true, // 跨域
        queueLimit: 10, //文件个数
        removeAfterUpload: false //上传后删除文件
      });
      uploader.filters.push({
        name: 'fileFilter',
        fn: function (item, options) {
          $scope.uploadParam.names.push({
            fileName: item.name
          });
          $scope.uploadParam.name += item.name + ',';
          return true;
        }
      });
      uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        uploader.clearQueue();
        uploader.destroy();
        $scope.uploadParam.names = [];
        $scope.uploadParam.name = '';
        console.info('onWhenAddingFileFailed', item.name);
      };
      uploader.onBeforeUploadItem = function (item) {
        Array.prototype.push.apply(item.formData, uploader.formData);
        console.info('onBeforeUploadItem', item);
      };
      uploader.onCompleteAll = function (fileItem, response, status, header) {
        console.info('onCompleteAll');
        var arr = [];
        $scope.uploadParam.names.forEach(function (n) {
          var ary = n.serverFileName.split('/');
          arr.push(ary[ary.length - 1]);
        });
        $scope.uploadParam.name = arr.join(',');
        $scope.$apply();
        save($scope.saveStatus);
      };
      uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', response.data.qualifiedName);
        $scope.uploadParam.names.forEach(function (name) {
          if (name.fileName == fileItem.file.name) {
            name.serverFileName = response.data.qualifiedName;
          }
        });
        $scope.uploadFilePath += response.data.qualifiedName + ',';
      };
      uploader.onErrorItem = function (fileItem, response, status, headers) {
        growl.warning("上传文件失败", {});
      };
      $scope.uploadParam = {
        "name": '',
        names: [],
        label: ''
      };
      $scope.removeSelectedFile = function (fileName) {
        uploader.queue.forEach(function (qu, ind) {
          if (qu.file.name == fileName) {
            uploader.queue.splice(ind, 1);
          }
        });
        $scope.uploadParam.names.forEach(function (n, ind) {
          if (n.fileName == fileName) {
            $scope.uploadParam.names.splice(ind, 1)
          }
        });

        var arr = [];
        $scope.uploadParam.names.forEach(function (n) {
          if (n.serverFileName) {
            var ary = n.serverFileName.split('/');
            arr.push(ary[ary.length - 1]);
          } else {
            arr.push(n.fileName);
          }
        });
        $scope.uploadParam.name = arr.join(',');
      }
      $scope.saveStatus;
      $scope.workType = $routeParams.workType;
      $scope.state = $routeParams.state;
      $scope.orderType = "";
      $scope.priorityCode = "";
      $scope.processType = [];
      $scope.workList = "";
      $scope.tasksList = "";
      $scope.historyData = "";
      $scope.process = "";
      $scope.processTime = "";
      $scope.myObj = {};
      $scope.myObjTop = {};
      $scope.historyData = {
        columns: [{
          title: "处理人",
          data: "handlerName"
        }, {
          title: "处理时间",
          data: "finishedTime"
        }],
        columnDefs: [{
          "targets": 1,
          "data": "finishedTime",
          "render": function (data, type, full) {
            var str = "";
            if (data) {
              str = useMomentFormat(data, "yyyy-MM-dd hh:mm:ss");
            }
            // 返回自定义内容
            return str;
          }
        }]
      };
      $scope.devicesAll = "";
      $scope.allFault = "";
      $scope.findFault = function () {
        resourceUIService.findFaultKnowledgeByModelId($scope.orderAddData.deviceId.modelId, function (res) {
          if (res.code == 0) {
            $scope.initData.faultList = res.data;
          }
        });
      };
      $scope.major = {"spareIds": ""};
      $scope.sparePartsArray = {};
      $scope.allSpareParts = [];
      $scope.sparePartsInitList = {};
      var querySpareParts = function (modelId) {
        $scope.sparePartsInitList.data = [];
        //查询所有备件
        sparePartUIService.getSparePartByModelId(modelId, function (data) {
          if (data.code == 0) {
            var newObj = [];
            if (data.data) {
              data.data.forEach(function (obj) {
                obj.text = obj.name;
                $scope.sparePartsArray[obj.id] = obj;
                newObj.push(obj);
              });
            }
            $scope.allSpareParts = newObj;
          }
        });
      };
      $scope.selectList = {};
      $scope.addAttachment = function () {
        var newObj = {
          name: "",
          label: "",
          stockNumber: "",
          isEdit: 3,
          id: null
        }
        var addList = []
        for (var n in $scope.selectList.allSparePartsList) {
          var index = -1;
          for (var j in $scope.sparePartsInitList.data) {
            if ($scope.selectList.allSparePartsList[n].id == $scope.sparePartsInitList.data[j].id) {
              index = j
            }
          }
          if (index == -1) {
            addList.push($scope.selectList.allSparePartsList[n]);
          }
        }
        for (var i in $scope.sparePartsInitList.data) {
          if ($scope.sparePartsInitList.data[i].id == null) {
            growl.warning("当前有未保存的备件", {})
            return;
          }
        }
        $scope.sparePartsInitList.data.unshift(newObj);
        //$scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
        $scope.definitions.selectList = "";
      };
      $scope.historyGo = function () {
        var state = $routeParams.state;
        location.href = "index.html#/workorderrecord";
      };
      $scope.saveAttachment = function (selectStatus) {
        var tmp = -1;
        for (var i in $scope.sparePartsInitList.data) {
          if ($scope.major.spareIds == $scope.sparePartsInitList.data[i].id) {
            growl.warning("该备件已经使用", {});
            tmp = $scope.major.spareIds;
            break;
          }
        }
        if (tmp == -1) {
          if (!$scope.sparePartsInitList.data) $scope.sparePartsInitList.data = [];
          $scope.sparePartsArray[$scope.major.spareIds]["edit"] = 7;
          $scope.sparePartsArray[$scope.major.spareIds].editNumber = "";
          $scope.sparePartsInitList.data.unshift($scope.sparePartsArray[$scope.major.spareIds]);
          $scope.major.spareIds = "";
          $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
        }
      };
      $scope.formAryList = [];
      $scope.definitions = {};
      $scope.startList = "";
      var workFlowValue = function (flowId, value) {
        workflowService.getWorkflowById(flowId, function (returnObj) {
          if (returnObj.code == 0) {
            var resAry = returnObj.data.startAttributeDefinitions;
            var vList = [];
            for (var i in resAry) {
              var typePro = {};
              typePro["label"] = resAry[i].label;
              typePro["name"] = resAry[i].name;
              typePro["dataType"] = resAry[i].dataType;
              typePro["value"] = value[resAry[i].label];
              vList.push(typePro);
            }
            $scope.startList = vList;
            console.log("startvalue======" + JSON.stringify(vList));
          }
        })
      }
      var orderTicket = function (id, processDefinitionId, taskObj) {
        //根据工单Id获取工单详情
        ticketTaskService.getTicket(id, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.commitTime = formatDate(returnObj.data.commitTime);
            returnObj.data.finishedTime = formatDate(returnObj.data.finishedTime);
            $scope.workList = returnObj.data;
            if ($scope.workType == 'task') {
              if ($scope.workList.finishedTime == null || $scope.workList.finishedTime == '') {
                $scope.processTime = "0";
              }
              if (returnObj.data.values != null && returnObj.data.values != "") {
                workFlowValue(processDefinitionId, returnObj.data.values);
              }
            }
            if (taskObj != undefined) {
              $scope.workList["taskConfigName"] = taskObj.taskConfigName;
            }
            //通过工单号,获取任务
            ticketTaskService.getTicketTasks(id, function (returnObj1) {
              if (returnObj1.code == 0) {
                var searchList = [];
                for (var i in returnObj1.data) {
                  if (returnObj1.data[i].taskStatus == 200 || returnObj1.data[i].taskStatus == 100) {
                    searchList.push(returnObj1.data[i]);
                  }
                }
                $scope.historyData.data = searchList;
                $scope.$broadcast(Event.WORKORDERRECORDINIT + "_history", $scope.historyData);
                $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
              }
            });
          }
        });
      }
      $scope.cancelAttach = function (data) {
        for (var j in $scope.sparePartsInitList.data) {
          if ($scope.sparePartsInitList.data[j].isEdit == 3 && data.isEdit == 3) {
            $scope.sparePartsInitList.data.splice(j, 1);
          } else if ($scope.sparePartsInitList.data[j].id == data.id) {
            $scope.sparePartsInitList.data.splice(j, 1);
          }
        }
        $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
      }
      var formatDate = function (str) {
        if (str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      }
      $scope.save = function (status) {
        $scope.saveStatus = status;
        if ($scope.uploadParam.name) {
          $scope.uploader.formData.push({
            resourceId: 100,
            type: encodeURIComponent('ticket')
          });
          $scope.uploader.uploadAll();
        } else {
          save(status);
        }
      };
      var save = function (status) {
        $scope.detail.taskStatus = status;
        if ($scope.sparePartsInitList.data && $scope.sparePartsInitList.data.length > 0) {
          var table = $('table[name="major"]').DataTable();
          var data = table.$('input').serializeArray();
          var spareList = $scope.sparePartsInitList.data;
          var valueList = [];
          for (var i in data) {
            for (var j in spareList) {
              if (data[i].name == spareList[j].id) {
                if (data[i].value) {
                  spareList[j].stockNumber = data[i].value;
                  valueList.push(spareList[j]);
                } else {
                  growl.warning("您有备件数量没有输入,请输入之后再保存", {});
                  return;
                }
              }
            }
          }
          $scope.definitions["stockOrderItemList"] = valueList;
        }
        if ($scope.uploadParam.name) {
          var arr = [];
          $scope.uploadParam.names.forEach(function (n) {
            arr.push(n.serverFileName);
          });
          $scope.definitions[$scope.uploadParam.label] = arr.join(',');
        }
        $scope.detail["values"] = $scope.definitions;
        if ($scope.myObj.ticketStatus) {
          ticketTaskService.doTask($scope.detail, function (returnObj) {
            if (returnObj.code == 0) {
              if (status == 100) {
                growl.success("工单已确认", {});
              } else if (status == 200) {
                growl.success("工单已完成", {});
                $scope.historyGo();
              }
            } else {
              growl.warning("工单操作失败", {});
            }
          });
        } else {
          growl.warning("已经有其他人在处理此工单");
        }
      };
      $scope.objStr = function (str) {
        try {
          var jsonStr = $.parseJSON(str)
          return jsonStr;
        } catch (err) {
          return [];
        }
      }
      var process = function getProcessType() {
        if ($scope.workType == 'task') {
          var promises = [];
          promises.push(getTicketTaskById(id));
          promises.push(isMyTicketTask(id));
          $q.all(promises).then(function (ret) {
            var taskObj = ret[0];
            $scope.detail = taskObj.data;
            var statList = taskObj.data.values;
            if (taskObj.data.variables.modelID != undefined) {
              querySpareParts(taskObj.data.variables.modelID);
            }
            if (taskObj.data && taskObj.data.attributeDefinitions != "" && taskObj.data.attributeDefinitions != null) {
              var resAry = taskObj.data.attributeDefinitions;
              resAry = resAry.sort(function (a, b) {
                return a.reorder - b.reorder;
              });
              for (var i in resAry) {
                var typePro = {};
                if (resAry[i].dataType == 'select' && resAry[i]['dynamicValue']) {
                  resAry[i].selectValue = resAry[i]['dynamicValue'];
                }
                $.each(resAry[i], function (name, value) {
                  typePro[name] = value;
                  if (value && name == "selectValue") {
                    if (typeof value == 'string') {
                      typePro[name] = $scope.objStr(value);
                    } else {
                      typePro[name] = value;
                    }
                  } else {
                    typePro[name] = value;
                  }
                });
                if (taskObj.data.taskStatus == "200" || taskObj.data.taskStatus == "100") {
                  var statList = taskObj.data.values;
                  $scope.definitions[resAry[i].label] = statList[resAry[i].label];
                  if (resAry[i].dataType == 'uploader') {
                    $scope.uploadParam.names = [];
                    $scope.uploadParam.name = '';
                    $scope.uploadFilePath = statList[resAry[i].label];
                    $scope.uploadParam.label = resAry[i].label;
                    statList[resAry[i].label].split(',').forEach(function (path) {
                      path = $.trim(path);
                      if (path) {
                        $scope.uploadParam.names.push({
                          serverFileName: path
                        });
                      }
                    });
                    var arr = [];
                    $scope.uploadParam.names.forEach(function (n) {
                      var ary = n.serverFileName.split('/');
                      arr.push(ary[ary.length - 1]);
                    });
                    $scope.uploadParam.name = arr.join(',');
                  }
                } else {
                  $scope.definitions[resAry[i].label] = "";
                  if (resAry[i].dataType == 'uploader') {
                    $scope.uploadParam.label = resAry[i].label;
                  }
                }
                $scope.formAryList.push(typePro);
              }
              console.info("formAryList====", $scope.formAryList);
              if (taskObj.data.values && taskObj.data.values.stockOrderItemList != undefined
                && taskObj.data.values.stockOrderItemList != null
                && taskObj.data.values.stockOrderItemList != "") {
                var orderList = taskObj.data.values.stockOrderItemList;
                for (var j in orderList) {
                  orderList[j].editNumber = orderList[j].stockNumber;
                  if ($scope.sparePartsArray[orderList[j].id] != undefined) {
                    $scope.sparePartsArray[orderList[j].id].editNumber = orderList[j].stockNumber;
                  }
                }
                $scope.sparePartsInitList.data = taskObj.data.values.stockOrderItemList;
              }
              orderTicket(taskObj.data.ticketNo, taskObj.data.processDefinitionId, taskObj.data);
            } else {
              orderTicket(taskObj.data.ticketNo, taskObj.data.processDefinitionId);
            }
          });
        } else if ($scope.workType == 'order') {
          orderTicket(id, 0);
        }
      };
      var getTicketTaskById = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.getTicketTaskById(ticketTaskId, function (taskObj) {
          if (taskObj.code == 0) {
            defer.resolve(taskObj);
          }
        });
        return defer.promise;
      };
      var isMyTicketTask = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.isMyTicketTask(ticketTaskId, function (ticketStatus) {
          if (ticketStatus.code == 0) {
            $scope.myObj["ticketStatus"] = ticketStatus.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 获得客户列表
      $scope.customersList;
      $scope.customersDic = {};
      var queryCustomer = function () {
        var defer = $q.defer();
        customerUIService.findCustomersByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.customersDic = returnObj.customerDic;
            returnObj.data.forEach(function (item) {
              item.text = item.customerName;
            });
            $scope.customersList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };

      // 查询项目
      $scope.projectsList;
      $scope.projectsDic = {};
      var queryProject = function () {
        var defer = $q.defer();
        projectUIService.findProjectsByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };

      // 查询企业下面的用户
      $scope.userList;
      $scope.userDic = {};
      var userByCondition = function () {
        var defer = $q.defer();
        userUIService.queryUserByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.userDic[item.userID] = item;
            })
            $scope.userList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };

      //获取所有设备
      $scope.devicesList = [];
      $scope.devicesDic = {};
      var queryDevices = function () {
        var defer = $q.defer();
        resourceUIService.getDevicesByCondition({}, function (res) {
          if (res.code == 0) {
            $scope.devicesDic = res.data;
            res.data.forEach(function (item) {
              $scope.devicesDic[item.id] = item;
            })
            $scope.devicesList = res.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };

      // 从 info.json 中获取工单分类和紧急度
      var getInfo = function () {
        var defer = $q.defer();
        Info.get("../localdb/info.json", function (info) {
          $scope.orderType = $scope.myDicts['ticketCategory'];//工单分类
          $scope.priorityCodeList = info.priorityData;//紧急度
          defer.resolve();
        });
        return defer.promise;
      };

      // 获取工单流程
      var getTicketCategorys = function () {
        var defer = $q.defer();
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              $scope.processType = returnObj.data;
            }
            defer.resolve();
          }
        });
        return defer.promise;
      };

      // 页面初始化执行的方法
      var init = function () {
        var promises = [];
        promises.push(queryCustomer());
        promises.push(queryDevices());
        promises.push(queryProject());
        promises.push(userByCondition());
        promises.push(getTicketCategorys());
        promises.push(getInfo());
        $q.all(promises).then(function () {
          var UA = navigator.userAgent.toLowerCase();
          if (UA.indexOf("webkit") < 0) {
            $scope.browserClass = "wrong";
            $scope.myObj = {"display": "inline-flex"};
            $scope.myObjTop = {"margin-top": "6px"};
          }
          process();
        });
      }
      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);
  //从模板地址进来的地址
  controllers.initController('processDetailCtrl', ['$scope', '$rootScope', 'FileUploader', '$location', '$controller', '$routeParams', '$timeout', 'userUIService', 'sparePartUIService', 'growl', 'workflowService', 'userEnterpriseService', 'Info', '$route', 'projectUIService', 'ticketTaskService', 'maintenanceUIService',
    function ($scope, $rootScope, FileUploader, $location, $controller, $routeParams, $timeout, userUIService, sparePartUIService, growl, workflowService, userEnterpriseService, Info, $route, projectUIService, ticketTaskService, maintenanceUIService) {
      $scope.status = $routeParams.status;//获取跳转过来的任务状态
      var id = $routeParams.id;//获取跳转过来的任务id
      $scope.workType = $routeParams.workType;
      $scope.sparePartsArray = {};
      $scope.devicesList = [];
      $scope.imgList = [];
      $scope.selectMajor = '';
      $scope.taskList = {
        "ticketNo": "",
        "ticketTitle": "",
        "ticketCommitTime": "",
        "ticketCreatorName": "",
        "customerName": "",
        "projectName": "",
        "projectID": "",
        "modelName": "",
        "modelID": "",
        "deviceSn": "",
        "faultNo": "",
        "faultPhenomenon": ""
      };
      $scope.selectList = {};
      $scope.urlService = userUIService.uploadFileUrl;
      $scope.definitions = {"faultPhenomenon": "", "stockOrderItemList": "", "ticketTaskDesc": ""};
      $scope.addAttachment = function () {
        var newObj = {
          name: "",
          label: "",
          stockNumber: "",
          isEdit: 3,
          id: null
        }
        var addList = []
        for (var n in $scope.selectList.allSparePartsList) {
          var index = -1;
          for (var j in $scope.sparePartsInitList.data) {
            if ($scope.selectList.allSparePartsList[n].id == $scope.sparePartsInitList.data[j].id) {
              index = j
            }
          }
          if (index == -1) {
            addList.push($scope.selectList.allSparePartsList[n]);
          }
        }
        for (var i in $scope.sparePartsInitList.data) {
          if ($scope.sparePartsInitList.data[i].id == null) {
            growl.warning("当前有未保存的备件", {})
            return;
          }
        }
        $scope.sparePartsInitList.data.unshift(newObj);
        //$scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
        $scope.definitions.selectList = "";
      }
      $scope.sparePartsInitList = {};
      $scope.serviceOrigin = userUIService.uploadFileUrl + '/api/rest/upload/maintenanceUIService/uploadTaskImage';
      $controller('AppUploadCtrl', {$scope: $scope, growl: growl, FileUploader: FileUploader});
      $scope.toggle = function toggle() {
        $('#nv-file-select').click();
      }
      $scope.uploadExcel = function (config) {
        /*  $scope.uploader.formData = [];
          $scope.uploader.formData.push({
            config: 'deviceModel'
          });*/
        $scope.uploader.uploadAll();
      };
      $scope.$on("uploadTemplate", function (event, args) {
        if (args.response.code == 0) {
          growl.success("上传成功", {})
          $scope.imgList.push(args.response.data.file);
          $scope.$apply();
        }
      });
      $scope.uploader.onAfterAddingFile = function (fileItem) {
        if ($scope.uploader.queue.length > $scope.queueLimit) {
          $scope.uploader.removeFromQueue(0);
        }
        $scope.uploadExcel();
      };
      $scope.saveAttachment = function (selectStatus) {
        var tmp = -1;
        // if (selectStatus.id == -1) return;
        for (var i in $scope.sparePartsInitList.data) {
          if ($scope.selectMajor == $scope.sparePartsInitList.data[i].id) {
            growl.warning("该备件已经使用", {});
            tmp = $scope.selectMajor;
            break;
          }
        }
        if (tmp == -1) {
          if (!$scope.sparePartsInitList.data) $scope.sparePartsInitList.data = [];
          $scope.sparePartsArray[$scope.selectMajor]["edit"] = 7;
          // $scope.sparePartsArray[$scope.selectMajor] = selectStatus;
          $scope.sparePartsArray[$scope.selectMajor].editNumber = "";
          $scope.sparePartsInitList.data.unshift($scope.sparePartsArray[$scope.selectMajor]);
          $scope.selectMajor = "";
          $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);

        }
        //if($scope.sparePartsArray[selectStatus.id]){
        //
        //}
      };
      $scope.cancelAttach = function (data) {
        for (var j in $scope.sparePartsInitList.data) {
          if ($scope.sparePartsInitList.data[j].isEdit == 3 && data.isEdit == 3) {
            $scope.sparePartsInitList.data.splice(j, 1);
          } else if ($scope.sparePartsInitList.data[j].id == data.id) {
            $scope.sparePartsInitList.data.splice(j, 1);
          }
        }
        $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
      }
      $scope.processTask = function (status) {
        var table = $('table[name="major"]').DataTable();
        var data = table.$('input').serializeArray();
        var spareList = $scope.sparePartsInitList.data;
        var valueList = [];
        var statusSel = $scope.detail.taskStatus;
        for (var i in data) {
          for (var j in spareList) {
            if (data[i].name == spareList[j].id) {
              if (data[i].value) {
                spareList[j].stockNumber = data[i].value;
                valueList.push(spareList[j]);
              } else {
                growl.warning("您有备件数量没有输入,请输入之后再保存", {});
                return;
              }
            }
          }
        }
        $scope.definitions.stockOrderItemList = valueList;
        $scope.detail["values"] = $scope.definitions;
        $scope.detail["maintenanceContent"] = $scope.devicesList;//	维保内容
        $scope.detail["images"] = $scope.imgList;//图片
        $scope.detail.taskStatus = status;
        if ($scope.selectList.ticketStatus) {
          ticketTaskService.doTask($scope.detail, function (returnObj) {
            if (returnObj.code == 0) {
              if (status == 200) {
                growl.success("处理任务成功", {});
                location.href = "index.html#/workorderrecord";
              } else {
                growl.success("任务已确认", {});
              }
            } else {
              $scope.detail.taskStatus = statusSel;
            }
          });
        }
      }
      var querySpareParts = function (modelId) {
        $scope.sparePartsInitList.data = [];
        //查询所有备件
        sparePartUIService.getSparePartByModelId(modelId, function (data) {
          if (data.code == 0) {
            var newObj = [];
            newObj.push({
              text: '请选择',
              label: '请选择',
              id: -1
            });
            if (data.data) {
              data.data.forEach(function (obj) {
                obj.text = obj.name;
                $scope.sparePartsArray[obj.id] = obj;
                newObj.push(obj);
              });
            }
            $scope.allSpareParts = newObj;
          }
        });
      }
      var ticketDetail = function () {
        //通过任务id查任务详情
        ticketTaskService.getTicketTaskById(id, function (taskObj) {
          if (taskObj.code == 0) {
            if ($scope.status == 'spare' && taskObj.data.variables.modelID != undefined) {
              querySpareParts(taskObj.data.variables.modelID);
            }
            if (taskObj.data.deviceId) {
              if (taskObj.data.maintenanceContent && taskObj.data.maintenanceContent.length > 0) {
                $scope.devicesList = taskObj.data.maintenanceContent;
              } else {
                itemsByDevice(taskObj.data.deviceId);
              }
            }
            $scope.detail = taskObj.data;
            $scope.taskList.ticketNo = taskObj.data.ticketNo;
            $scope.taskList.ticketTitle = taskObj.data.ticketTitle;
            if (taskObj.data.variables != "" && taskObj.data.variables != null) {
              $scope.taskList.ticketCommitTime = newDateJson(taskObj.data.variables.ticketCommitTime).Format(GetDateCategoryStrByLabel());
              $scope.taskList.projectId = taskObj.data.variables.device.projectId;
            }
            $scope.taskList.ticketCreatorName = taskObj.data.variables.ticketCreatorName;
            $scope.taskList.modelName = taskObj.data.variables.modelName;
            $scope.taskList.modelID = taskObj.data.variables.modelID;
            //if(taskObj.data.variables.customer != "" && taskObj.data.variables.customer != ""){
            $scope.taskList.customerID = taskObj.data.variables.customerID;
            $scope.taskList.customerName = taskObj.data.variables.customerName;
            //}
            /* if (taskObj.data.variables.project != "" && taskObj.data.variables.project != null) {
               $scope.taskList.projectName = taskObj.data.variables.project.label;
               $scope.taskList.projectID = taskObj.data.variables.project.id;
             }*/
            $scope.taskList.faultNo = taskObj.data.variables.faultNo;
            $scope.taskList.deviceSn = taskObj.data.variables.deviceSn;
            $scope.taskList.faultPhenomenon = taskObj.data.variables.faultPhenomenon;
            if (taskObj.data.images) {
              $scope.imgList = taskObj.data.images;
            }
            if (taskObj.data.values != null && taskObj.data.values != "") {
              $scope.definitions.ticketTaskDesc = taskObj.data.values.ticketTaskDesc;
              if (taskObj.data.values.stockOrderItemList != null && taskObj.data.values.stockOrderItemList != "") {
                $scope.sparePartsInitList.data = taskObj.data.values.stockOrderItemList;
                var orderList = taskObj.data.values.stockOrderItemList;
                for (var j in orderList) {
                  if ($scope.sparePartsArray[orderList[j].id] != undefined) {
                    $scope.sparePartsArray[orderList[j].id].editNumber = orderList[j].stockNumber;
                  }
                }
                //$scope.$broadcast(Event.WORKORDERRECORDINIT+"_deviceTask", $scope.sparePartsInitList);
              }
            }
            $scope.$broadcast(Event.WORKORDERRECORDINIT + "_deviceTask", $scope.sparePartsInitList);
          }
        });
      };
      var itemsByDevice = function (deviceId) {
        maintenanceUIService.getInspectionItemsByDeviceId(deviceId, function (res) {
          if (res.code == 0) {
            res.data.forEach(function (obj) {
              obj["status"] = "0";
            });
            $scope.devicesList = res.data;
          }
        });
      }
      var init = function () {
        ticketTaskService.isMyTicketTask(id, function (ticketStatus) {
          if (ticketStatus.code == 0) {
            $scope.selectList["ticketStatus"] = ticketStatus.data;
          }
        });
        ticketDetail();
      };
      /**
       * 查询项目
       */
      $scope.projectsList;
      $scope.projectsDic = {};
      $scope.queryProject = function () {
        projectUIService.findProjectsByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
            init();
          }
        })
      };
      $scope.queryProject();
    }
  ]);
  //工单任务历史记录
  controllers.initController('workTimeLineCtrl', ['$scope', '$rootScope', '$location', '$routeParams', '$timeout', 'ticketLogService', 'growl', 'workflowService', 'userEnterpriseService', 'Info', '$route', 'ticketTaskService', 'processService',
    function ($scope, $rootScope, $location, $routeParams, $timeout, ticketLogService, growl, workflowService, userEnterpriseService, Info, $route, ticketTaskService, processService) {
      var id = $routeParams.id;//获取跳转过来的任务id
      $scope.historyList = null;
      $scope.workOrderId = id;
      $scope.workOrderDetail = null;
      $scope.hrefList = function (url, id) {
        var fullUrl = url.split('?');
        if (fullUrl[1]) {
          url = fullUrl[0] + "/" + id + '?' + fullUrl[1];
        }
        location.href = url;
      };
      if (id != '' && id != null) {
        ticketTaskService.getTicket(id, function (resData) {
          if (resData.code == 0) {
            $scope.workOrderDetail = resData.data;
          }
        });
        ticketLogService.getByTicketNo(id, function (res) {
          if (res.code == 0) {
            $scope.historyList = res.data;
          }
        });
      }
    }
  ]);

  controllers.initController('WorkOrderRecordSelectPartCtrl', ['$scope', 'ngDialog', '$q', '$routeParams', 'faultKnowledgeUIService', 'growl', 'resourceUIService', 'Info', 'ticketTaskService', 'ticketCategoryService', 'userLoginUIService', 'customerUIService', 'projectUIService', 'userUIService', 'etlUIService',
    function ($scope, ngDialog, $q, $routeParams, faultKnowledgeUIService, growl, resourceUIService, Info, ticketTaskService, ticketCategoryService, userLoginUIService, customerUIService, projectUIService, userUIService, etlUIService) {
      var id = $routeParams.id;
      var queryPartEtlId = $routeParams.queryPartEtlId;
      var createOrderEtlId = $routeParams.createOrderEtlId;
      var queryCustomerEtlId = $routeParams.queryCustomerEtlId;
      $scope.allCustomers = [];
      $scope.queryItem = {};
      $scope.myObj = {};
      $scope.myObjTop = {};
      $scope.partList = [];
      $scope.historyData = {
        columns: [{
          title: "处理人",
          data: "handlerName"
        }, {
          title: "处理时间",
          data: "finishedTime"
        }],
        columnDefs: [{
          "targets": 1,
          "data": "finishedTime",
          "render": function (data, type, full) {
            var str = "";
            if (data) {
              str = useMomentFormat(data, "yyyy-MM-dd hh:mm:ss");
            }
            return str;
          }
        }]
      };
      $scope.selectedPart = [];
      $scope.partId = '';
      $scope.dialogObj = {};
      $scope.beforeTaskStatus = '';
      $scope.save = function (status) {
        $scope.detail["values"] = {
          parts: $scope.selectedPart
        };
        $scope.detail.taskStatus = status;
        if (status == 200) {
          var str = '';
          str += '将生成一个订单，订单内容如下:\n';
          $scope.selectedPart.forEach(function (item) {
            str += item.label + '(配件编码:' + item.code + ')    数量：' + item.count + '个\n';
          });
          BootstrapDialog.show({
            title: '提示',
            closable: false,
            message: str,
            buttons: [{
              label: '确定',
              cssClass: 'btn-success',
              action: function (dialogRef) {
                dialogRef.close();
                var param = {
                  partJson: []
                };
                $scope.selectedPart.forEach(function (item) {
                  var obj = {};
                  obj.id = item.id;
                  obj.count = Number(item.count);
                  obj.code = item.code;
                  param.partJson.push(obj);
                });
                var customerInfos = $scope.customer.split('||');
                param.customerName = customerInfos[0];
                param.customerCode = customerInfos[1];
                param.customerDept = customerInfos[2];
                param.ticketNo = $scope.detail.ticketNo;
                makeOrder(param).then(function (data) {
                  $scope.detail.values.orderId = data;
                  return doTask($scope.detail);
                }).then(function () {
                  $scope.beforeTaskStatus = 200;
                  growl.success("工单已完成", {});
                  window.history.back();
                });
              }
            }, {
              label: '取消',
              action: function (dialogRef) {
                $scope.detail.taskStatus = $scope.beforeTaskStatus;
                $scope.$apply()
                dialogRef.close();
              }
            }]
          });
        } else if (status == 100) {
          doTask($scope.detail).then(function () {
            $scope.beforeTaskStatus = 100;
            growl.success("工单已确认", {});
          });
        }
      };
      $scope.searchKnowledge = function () {
        $scope.queryItem = {
          ticketCategoryId: $scope.workList.ticketCategoryId
        };
        ngDialog.open({
          template: 'partials/workorder_record_search_knowledge.html',
          scope: $scope,
          className: 'ngdialog-theme-plain',
          name: 'searchKnowledge'
        });
      };
      $scope.goClear = function () {
        $scope.queryItem = {
          ticketCategoryId: $scope.workList.ticketCategoryId
        };
      };
      $scope.goSearch = function () {
        searchFaultKnowledge($scope.queryItem).then(function (data) {
          $scope.$broadcast(Event.FAULTKNOWLEDGEINIT, {
            data: data
          });
        });
      };
      var searchFaultKnowledge = function (queryObj) {
        var defer = $q.defer();
        faultKnowledgeUIService.getFaultKnowledgesByCondition(queryObj, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      $scope.searchPart = function () {
        ngDialog.open({
          template: 'partials/workorder_record_part_search.html',
          scope: $scope,
          className: 'ngdialog-theme-plain',
          name: 'searchPart'
        });
      };
      $scope.canSearchPart = function () {
        return !!$scope.partCode;
      };
      $scope.confirmSelectPart = function () {
        var selectedParts = $scope.partList.filter(function (part) {
          return Number(part.count) > 0;
        });
        $scope.selectedPart.forEach(function (item) {
          selectedParts.forEach(function (part) {
            if (item.id == part.id && item.code == part.code) {
              item.count = part.count;
            }
          });
        });
        var newParts = [];
        selectedParts.forEach(function (part) {
          var flag = false;
          $scope.selectedPart.forEach(function (item) {
            if (item.id == part.id && item.code == part.code) {
              flag = true;
            }
          });
          if (!flag) {
            newParts.push(part);
          }
        });
        $scope.selectedPart = $scope.selectedPart.concat(newParts);
        $scope.$broadcast('WorkOrderSelectPart', {
          data: $scope.selectedPart,
          name: 'page'
        });
        $scope.closeDialog();
        $scope.partCode = null;
      };
      $scope.deleteSelectPart = function (rowData, callback) {
        var index = $scope.selectedPart.indexOf(rowData);
        $scope.selectedPart.splice(index, 1);
        $scope.$apply();
        callback();
      };
      $scope.confirmSelectFaultKnowledge = function (faultKnowledge) {
        var selectedParts = faultKnowledge.values.parts || [];
        $scope.selectedPart = selectedParts;
        $scope.$broadcast('WorkOrderSelectPart', {
          data: $scope.selectedPart,
          name: 'page'
        });
        $scope.closeDialog();
      };
      // 创建订单
      var makeOrder = function (param) {
        var defer = $q.defer();
        etlUIService.executeJob(createOrderEtlId, param, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data)
          }
        });
        return defer.promise;
      };
      var queryCustomerByEtl = function (param) {
        var defer = $q.defer();
        etlUIService.executeJob(queryCustomerEtlId, param, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data)
          }
        });
        return defer.promise;
      };
      // 执行任务
      var doTask = function (task) {
        var defer = $q.defer();
        ticketTaskService.doTask(task, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          } else {
            $scope.detail.taskStatus = $scope.beforeTaskStatus;
          }
        });
        return defer.promise;
      };
      // 查询配件
      var findParts = function (partCode) {
        var defer = $q.defer();
        $scope.partList = [];
        $scope.dialogObj = {};
        etlUIService.executeJob(queryPartEtlId, {
          part: partCode
        }, function (ret) {
          $scope.partList = JSON.parse(ret.data);
          $scope.partList.forEach(function (item) {
            $scope.selectedPart.forEach(function (part) {
              if (item.id == part.id && item.code == part.code) {
                item.count = part.count;
              }
            });
            item.inventory = 100;
          });
          defer.resolve();
        });
        return defer.promise;
      };
      //根据工单Id获取工单详情
      var orderTicket = function (ticketNo) {
        var defer = $q.defer();
        ticketTaskService.getTicket(ticketNo, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      //获取执行历史数据
      var getHistoryData = function (ticketNo) {
        var defer = $q.defer();
        ticketTaskService.getTicketTasks(ticketNo, function (ret) {
          if (ret.code == 0) {
            var searchList = [];
            for (var i in ret.data) {
              if (ret.data[i].taskStatus == 200 || ret.data[i].taskStatus == 100) {
                searchList.push(ret.data[i]);
              }
            }
            $scope.historyData.data = searchList;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      //根据id获取工单任务详情
      var getTicketTaskById = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.getTicketTaskById(ticketTaskId, function (taskObj) {
          if (taskObj.code == 0) {
            if (taskObj.data.values && taskObj.data.values.parts) {
              $scope.selectedPart = taskObj.data.values.parts;
            }
            defer.resolve(taskObj);
          }
        });
        return defer.promise;
      };
      var isMyTicketTask = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.isMyTicketTask(ticketTaskId, function (ticketStatus) {
          if (ticketStatus.code == 0) {
            $scope.myObj["ticketStatus"] = ticketStatus.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      var process = function getProcessType() {
        var promises = [];
        promises.push(getTicketTaskById(id));
        promises.push(isMyTicketTask(id));
        $q.all(promises).then(function (ret) {
          var taskObj = ret[0];
          $scope.detail = taskObj.data;
          $scope.beforeTaskStatus = $scope.detail.taskStatus;
          $scope.$broadcast('WorkOrderSelectPart', {
            data: $scope.selectedPart,
            name: 'page'
          });
          var defers = [];
          defers.push(getHistoryData(taskObj.data.ticketNo));
          defers.push(orderTicket(taskObj.data.ticketNo));
          return $q.all(defers);
        }).then(function (ret) {
          $scope.$broadcast(Event.WORKORDERRECORDINIT + "_history", $scope.historyData);
          var workList = ret[1];
          workList.commitTime = formatDate(workList.commitTime);
          workList.finishedTime = formatDate(workList.finishedTime);
          $scope.workList = workList;
        });
      };
      var formatDate = function (str) {
        if (str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      };
      // 获得客户列表
      $scope.customersList;
      $scope.customersDic = {};
      var queryCustomer = function () {
        var defer = $q.defer();
        customerUIService.findCustomersByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            $scope.customersDic = returnObj.customerDic;
            returnObj.data.forEach(function (item) {
              item.text = item.customerName;
            });
            $scope.customersList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 查询项目
      $scope.projectsList;
      $scope.projectsDic = {};
      var queryProject = function () {
        var defer = $q.defer();
        projectUIService.findProjectsByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.projectsDic[item.id] = item;
              item.text = item.projectName;
            })
            $scope.projectsList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 查询企业下面的用户
      $scope.userList;
      $scope.userDic = {};
      var userByCondition = function () {
        var defer = $q.defer();
        userUIService.queryUserByCondition({}, function (returnObj) {
          if (returnObj.code == 0) {
            returnObj.data.forEach(function (item) {
              $scope.userDic[item.userID] = item;
            })
            $scope.userList = returnObj.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      //获取所有设备
      $scope.devicesList = [];
      $scope.devicesDic = {};
      var queryDevices = function () {
        var defer = $q.defer();
        resourceUIService.getDevicesByCondition({}, function (res) {
          if (res.code == 0) {
            $scope.devicesDic = res.data;
            res.data.forEach(function (item) {
              $scope.devicesDic[item.id] = item;
            })
            $scope.devicesList = res.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 从 info.json 中获取工单分类和紧急度
      var getInfo = function () {
        var defer = $q.defer();
        Info.get("../localdb/info.json", function (info) {
          $scope.orderType = $scope.myDicts['ticketCategory'];//工单分类
          $scope.priorityCodeList = info.priorityData;//紧急度
          defer.resolve();
        });
        return defer.promise;
      };
      // 获取工单流程
      var getTicketCategorys = function () {
        var defer = $q.defer();
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              $scope.processType = returnObj.data;
            }
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 获取设备模板
      $scope.deviceModelList = [];
      var getDeviceModel = function () {
        var defer = $q.defer();
        resourceUIService.getModelsByCondition({}, function (res) {
          if (res.code == 0) {
            $scope.deviceModelList = res.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      var init = function () {
        var promises = [];
        promises.push(queryCustomer());
        promises.push(queryDevices());
        promises.push(queryProject());
        promises.push(userByCondition());
        promises.push(getTicketCategorys());
        promises.push(getInfo());
        promises.push(getDeviceModel());

        $q.all(promises).then(function () {
          queryCustomerByEtl({}).then(function (data) {
            $scope.allCustomers = JSON.parse(data);
          });
          var UA = navigator.userAgent.toLowerCase();
          if (UA.indexOf("webkit") < 0) {
            $scope.browserClass = "wrong";
            $scope.myObj = {"display": "inline-flex"};
            $scope.myObjTop = {"margin-top": "6px"};
          }
          process();
        });
      };

      $scope.$on('ngDialog.opened', function (e, data) {
        if (data && data.name === 'searchPart') {
          findParts($scope.partCode).then(function () {
            $scope.$broadcast('WorkOrderSelectPart', {
              data: $scope.partList,
              name: 'dialog'
            });
          });
        }
        if (data && data.name === 'searchKnowledge') {
          $scope.$broadcast(Event.FAULTKNOWLEDGEINIT, {
            data: []
          });
        }
      });

      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);

  controllers.initController('WorkOrderRecordPartOrderCtrl', ['$scope', 'ngDialog', '$q', '$routeParams', 'growl', 'resourceUIService', 'Info', 'ticketTaskService', 'ticketCategoryService', 'userLoginUIService', 'customerUIService', 'projectUIService', 'userUIService', 'etlUIService',
    function ($scope, ngDialog, $q, $routeParams, growl, resourceUIService, Info, ticketTaskService, ticketCategoryService, userLoginUIService, customerUIService, projectUIService, userUIService, etlUIService) {
      var id = $routeParams.id;
      var etlId = $routeParams.etlId;
      $scope.myObj = {};
      $scope.myObjTop = {};
      $scope.partList = [];
      $scope.historyData = {
        columns: [{
          title: "处理人",
          data: "handlerName"
        }, {
          title: "处理时间",
          data: "finishedTime"
        }],
        columnDefs: [{
          "targets": 1,
          "data": "finishedTime",
          "render": function (data, type, full) {
            var str = "";
            if (data) {
              str = useMomentFormat(data, "yyyy-MM-dd hh:mm:ss");
            }
            return str;
          }
        }]
      };
      $scope.selectedPart = [];
      $scope.partId = '';
      $scope.save = function (status) {
        $scope.detail.taskStatus = status;
        $scope.detail.values = $scope.detail.values || {};
        $scope.detail.values.orderStatus = $scope.workList.orderDetail.status;
        doTask($scope.detail).then(function () {
          if (status == 100) {
            growl.success("工单已确认", {});
          } else if (status == 200) {
            growl.success("工单已完成", {});
            window.history.back();
          }
        });
      };
      var getOrderStatus = function (orderId) {
        var defer = $q.defer();
        etlUIService.executeJob(etlId, {
          orderId: orderId
        }, function (ret) {
          if (ret.code == 0) {
            $scope.workList.orderDetail = ret.data;
          }
          defer.resolve();
        });
        return defer.promise;
      };
      // 执行任务
      var doTask = function (task) {
        var defer = $q.defer();
        ticketTaskService.doTask(task, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          } else {
            $scope.detail.taskStatus = 10;
          }
        });
        return defer.promise;
      };
      //根据工单Id获取工单详情
      var orderTicket = function (ticketNo) {
        var defer = $q.defer();
        ticketTaskService.getTicket(ticketNo, function (ret) {
          if (ret.code == 0) {
            defer.resolve(ret.data);
          }
        });
        return defer.promise;
      };
      //获取执行历史数据
      var getHistoryData = function (ticketNo) {
        var defer = $q.defer();
        ticketTaskService.getTicketTasks(ticketNo, function (ret) {
          if (ret.code == 0) {
            var searchList = [];
            for (var i in ret.data) {
              if (ret.data[i].taskStatus == 200 || ret.data[i].taskStatus == 100) {
                searchList.push(ret.data[i]);
              }
            }
            $scope.historyData.data = searchList;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      //根据id获取工单任务详情
      var getTicketTaskById = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.getTicketTaskById(ticketTaskId, function (taskObj) {
          if (taskObj.code == 0) {
            if (taskObj.data.values && taskObj.data.values.parts) {
              $scope.selectedPart = taskObj.data.values.parts;
            }
            defer.resolve(taskObj);
          }
        });
        return defer.promise;
      };
      // 判断是否是当前用户的任务
      var isMyTicketTask = function (ticketTaskId) {
        var defer = $q.defer();
        ticketTaskService.isMyTicketTask(ticketTaskId, function (ticketStatus) {
          if (ticketStatus.code == 0) {
            $scope.myObj["ticketStatus"] = ticketStatus.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      var process = function getProcessType() {
        var promises = [];
        promises.push(getTicketTaskById(id));
        promises.push(isMyTicketTask(id));
        $q.all(promises).then(function (ret) {
          var taskObj = ret[0];
          $scope.detail = taskObj.data;
          var defers = [];
          defers.push(getHistoryData(taskObj.data.ticketNo));
          defers.push(orderTicket(taskObj.data.ticketNo));
          return $q.all(defers);
        }).then(function (ret) {
          var ticket = ret[1];
          ticket.commitTime = formatDate(ticket.commitTime);
          ticket.finishedTime = formatDate(ticket.finishedTime);
          $scope.workList = ticket;

          $scope.selectedPart = ticket.values.parts;

          $scope.$broadcast(Event.WORKORDERRECORDINIT + "_history", $scope.historyData);
          $scope.$broadcast('WorkOrderSelectPart', {
            data: $scope.selectedPart,
            name: 'page'
          });

          getOrderStatus(ticket.values.orderId);

        });
      };
      var formatDate = function (str) {
        if (str) {
          str = newDateJson(str).Format(GetDateCategoryStrByLabel());
        }
        return str;
      };

      //获取所有设备
      $scope.devicesList = [];
      $scope.devicesDic = {};
      var queryDevices = function () {
        var defer = $q.defer();
        resourceUIService.getDevicesByCondition({}, function (res) {
          if (res.code == 0) {
            $scope.devicesDic = res.data;
            res.data.forEach(function (item) {
              $scope.devicesDic[item.id] = item;
            })
            $scope.devicesList = res.data;
            defer.resolve();
          }
        });
        return defer.promise;
      };
      // 从 info.json 中获取工单分类和紧急度
      var getInfo = function () {
        var defer = $q.defer();
        Info.get("../localdb/info.json", function (info) {
          $scope.orderType = $scope.myDicts['ticketCategory'];//工单分类
          $scope.priorityCodeList = info.priorityData;//紧急度
          defer.resolve();
        });
        return defer.promise;
      };
      // 获取工单流程
      var getTicketCategorys = function () {
        var defer = $q.defer();
        ticketCategoryService.getTicketCategorys(function (returnObj) {
          if (returnObj.code == 0) {
            for (var i in returnObj.data) {
              $scope.processType = returnObj.data;
            }
            defer.resolve();
          }
        });
        return defer.promise;
      };
      var init = function () {
        var promises = [];
        promises.push(queryDevices());
        promises.push(getTicketCategorys());
        promises.push(getInfo());
        $q.all(promises).then(function () {
          var UA = navigator.userAgent.toLowerCase();
          if (UA.indexOf("webkit") < 0) {
            $scope.browserClass = "wrong";
            $scope.myObj = {"display": "inline-flex"};
            $scope.myObjTop = {"margin-top": "6px"};
          }
          process();
        });
      };

      /**
       * 监听登录状态
       */
      if (!userLoginUIService.user.isAuthenticated) {
        $scope.$on('loginStatusChanged', function (evt, d) {
          if (userLoginUIService.user.isAuthenticated) {
            init();
          }
        });
      } else {
        init();
      }
    }
  ]);

});
