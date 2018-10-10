define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'], function(directives, BootstrapDialog, datatables) {
  'use strict';

  //======================================    点检计划     ===========================================
  directives.initDirective('checkPlanTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {

    return {
      restrict: 'A',
      controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
        var domMain = $element;
        var table;
        var ifShow = false;
        $scope.$on(Event.ALERTRULESINIT + "_check", function(event, args) {
          if(table) {
            table.destroy();
            domMain.empty();
          }
          table = domMain.DataTable({
            dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
            language: $.ProudSmart.datatable.language,
            select: $.ProudSmart.datatable.select,
            data: args.option[0],
            order: [
              [10, "desc"]
            ],
            columns: [$.ProudSmart.datatable.selectCol, {
              data: "checkAreaName",
              title: "点检区域"
            }, {
              data: "projectName",
              title: "点检计划名称"
            }, {
              data: "planNumber",
              title: "点检计划编号"
            }, {
              data: "periodicUnitName",
              title: "周期单位"
            }, {
              data: "periodicInterval",
              title: "周期间隔"
            }, {
              data: "startDate",
              title: "开始日期"
            }, {
              data: "startTime",
              title: "开始时间"
            }, {
              data: "createUserName",
              title: "制定人"
            }, {
              data: "planStatus",
              title: "启用",
              visible: $scope.menuitems['A13_S45'] ? true : false,
              orderable: false
            }, {
              data: "risingTime",
              title: "操作",
              visible: false
            }, $.ProudSmart.datatable.optionCol3],
            columnDefs: [{
              "targets": 0,
              "orderable": false,
              "render": function(data, type, full) {
                // 返回自定义内容
                if(type == "display") {
                  if(data) {
                    return '<input class="itemCheckBox" checked type="checkbox">';
                  } else {
                    return '<input class="itemCheckBox" type="checkbox">';
                  }
                }
                return "";
              }
            }, {
              targets: 1,
              data: "checkAreaName",
              render: function(data, type, full) {
                  //return escape(data);

                  var data = "TV厂模组车间";
                return data;
              }
            }, {
                targets: 2,
                data: "projectName",
                render: function(data, type, full) {
                    var data = "xxxxxxxx";
                    return data;
                }
            }, {
                targets: 3,
                data: "planNumber",
                render: function(data, type, full) {
                    var data = "xxxxxxxx";
                    return data;
                }
            }, {
              targets: 4,
              data: "periodicUnitName",
              render: function(data, type, full) {
                  var str = "日月年";
                  return str;
                }
            }, {
              targets: 5,
              data: "periodicInterval",
              render: function(data, type, full) {
                  var str = "1";
                  return str;
              }
            }, {
              targets: 6,
              data: "startDate",
              render: function(data, type, full) {

                var str = "2018.01.11";
                return str;
              }
            }, {
              targets: 7,
              data: "startTime",
              render: function(data, type, full) {
                  var str = "12:30";
                  return str;
              }
            }, {
              targets: 8,
              data: "createUserName",
              render: function(data, type, full) {
                  var str = "xxx";
                  return str;
                }
            }, {
              targets: 9,
              data: "planStatus",
              visible: $scope.menuitems['A13_S45'] ? true : false,
              render: function(data, type, full) {
                if(type == "display") {
                  if(data) {
                    return '<input class="enabledCheckBox" checked type="checkbox">';
                  } else {
                    return '<input class="enabledCheckBox" type="checkbox" >';
                  }
                }
                return "";
              }
            }, {
                targets: 10,
                data: "",
                render: function(data, type, full) {

                    return escape(data);
                }
            }, {
              "targets": 11,
              "data": "option",
              "render": function(data, type, full) {
                // 返回自定义内容
                var str = "<div class='btn-group btn-group-sm'>";
                  if($scope.menuitems['A06_S45']) {
                      str += "<button id='view-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 查看</span></button>";
                  }

                  if($scope.menuitems['A05_S45']) {
                      str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                  }
                  if($scope.menuitems['A04_S45']) {
                      str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                  }
                return str;
              }
            }],
            rowCallback: function(nRow, aData, iDataIndex) {
              if(aData.selected) {
                $(nRow).addClass("selected")
              } else {
                $(nRow).removeClass("selected")
              }
              $compile(nRow)($scope);
            }
          });
        });

        /**
         * 监听表格初始化后，添加按钮
         */

        domMain.on('click', '#view-btn', function(e) {
            e.preventDefault();
            $scope.showView = true;

            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.checkplanAddData = {

                "createUserId": rowData.createUserId,//创建人
                "createUserName": rowData.createUserName,//创建人姓名
                "updateUserName": rowData.updateUserName,//修改人姓名
                "planNumber": rowData.planNumber,//点检计划编号
                "projectName": rowData.projectName,//点检项目名称
                "checkAreaId": rowData.checkAreaId,//点检区域id
                "checkAreaName": rowData.checkAreaName,//点检区域名称
                "periodicUnitId": rowData.periodicUnitId,//周期单位id
                "periodicUnitName": rowData.periodicUnitName,//周期单位名称
                "periodicInterval": rowData.periodicInterval,//周期间隔
                "startDate": rowData.startDate,//开始日期
                "startTime": rowData.startTime,//开始时间
                "planStatus": "1",//是否启用，默认关闭状态
                "pointCheckLists": rowData.pointCheckLists,//点检项次
                "id": rowData.id,
                "domainPath": rowData.domainPath
            };
            $scope.addCheckPlan(rowData)

        });

        domMain.on('click', '#edit-btn', function(e) {

            $scope.showView=false;
            e.stopPropagation();
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();

            $scope.checkplanAddData = {
                "createUserId": rowData.createUserId,//创建人
                "createUserName": rowData.createUserName,//创建人姓名
                "updateUserName": rowData.updateUserName,//修改人姓名
                "planNumber": rowData.planNumber,//点检计划编号
                "projectName": rowData.projectName,//点检项目名称
                "checkAreaId": rowData.checkAreaId,//点检区域id
                "checkAreaName": rowData.checkAreaName,//点检区域名称
                "periodicUnitId": rowData.periodicUnitId,//周期单位id
                "periodicUnitName": rowData.periodicUnitName,//周期单位名称
                "periodicInterval": rowData.periodicInterval,//周期间隔
                "startDate": rowData.startDate,//开始日期
                "startTime": rowData.startTime,//开始时间
                "planStatus": "1",//是否启用，默认关闭状态
                "pointCheckLists": rowData.pointCheckLists,//点检项次
                "id": rowData.id,
                "domainPath": rowData.domainPath
            };
            $scope.addCheckPlan(rowData);
        });

        domMain.on('click', '#del-btn', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            $scope.doAction('delectCheckPlan', row.data());
        });

      /**
       * 勾选操作
       */
        domMain.on('change', '#allselect-btn', function(e) {
          e.stopPropagation();
          var abledIndex = 0;
          var unabledIndex = 0;
          if(e.target.checked) {
            table.rows().select();
            var tableRows = table.rows({
              selected: true
            });
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = true;
              if(row.data().enabled) { //启用
                abledIndex++;
              } else { //停用
                unabledIndex++;
              }
            };
            if(abledIndex == tableRows.count()) {
              $scope.unabled = true;
              $scope.selectedCount = 0;
            } else if(unabledIndex == tableRows.count()) {
              $scope.abled = true;
            } else {
              $scope.unabled = true;
              $scope.abled = true;
              $scope.selectedCount = 0;
            }
            table.rows().invalidate().draw(false);
            $scope.$apply();

          } else {
            var tableRows = table.rows({
              selected: true
            });
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              row.data().selected = false;
            };
            table.rows().deselect();
            table.rows().invalidate().draw(false);
            $scope.abled = false;
            $scope.unabled = false;
            $scope.selectedCount = 0;
            $scope.$apply();

          }
        });

        domMain.on('change', '.itemCheckBox', function(e) {
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var abledIndex = 0;
          var unabledIndex = 0;
          var tableRows = table.rows({
            selected: true
          });
          if(e.target.checked) {
            row.data().selected = true;
            if(row.data().enabled) { //启用
              $scope.unabled = true;
              $scope.selectedCount = 0;
            } else {
              $scope.abled = true;
            }
          } else {
            row.data().selected = false;
            var rows = table.rows();
            for(var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              if(row.data().enabled) { //启用
                abledIndex++;
              } else { //停用
                unabledIndex++;
              }
            };
            if(abledIndex > 0 && unabledIndex == 0) { //说明有启用,无停用
              $scope.abled = false;
              $scope.unabled = true;
              $scope.selectedCount = 0;
            } else if(unabledIndex > 0 && abledIndex == 0) { //说明有停用,无启用
              $scope.abled = true;
              $scope.unabled = false;
            }
          }
          if(tableRows.count() != table.rows()[0].length) {
            $('#allselect-btn').attr('checked', false)
            $('#allselect-btn').prop('checked', false);
          } else if(tableRows.count() == table.rows()[0].length) {
            $('#allselect-btn').attr('checked', true)
            $('#allselect-btn').prop('checked', true);
          }
          $scope.$apply();
        });

        domMain.on('change', '.enabledCheckBox', function(e) {
          var self = this;
          var tr = $(this).closest('tr');
          var row = table.row(tr);
          var param = [];
          if(e.target.checked) {
            row.data().enabled = true;
            param = [
              [row.data().id], true
            ];
          } else {
            row.data().enabled = false;
            param = [
              [row.data().id], false
            ];
          }
          $scope.doAction("AlertEnable", param, function(returnObj) {
            if(returnObj.code == 0) {
              table.rows().invalidate().draw(false);
              if(!e.target.checked) {
                $(self).prop("checked", false);
                growl.success("停用成功", {});
              } else {
                $(self).attr("checked", true);
                growl.success("启用成功", {});
              }
              $(".itemCheckBox").each(function() {
                $(this).attr("checked", false);
              });
              $("#allselect-btn").attr("checked", false);
              table.rows().deselect();
            } else if(!returnObj) {
              if(!e.target.checked) {
                row.data().enabled = true;
                $(self).prop("checked", true);
              } else {
                row.data().enabled = false;
                $(self).attr("checked", false);
              }
            }
          }, true);
        });

        //多项启用
        $scope.selectedEnable = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的告警规则项", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var AlertIdsArr = [];
          var ifGo = false; //这是之前前端判断失败成功个数的标志
          // var ifGo = true; //现在由后端判断失败和成功个数，这里就不需要判断ifGo了。故置成true
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            // AlertIdsArr.push(rowData.id);
            if(!rowData.enabled) {
              AlertIdsArr.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if(selectedCount == (successCount + errorCount)) {
              ifGo = true;
              // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
            }
          };
          if(ifGo) {
            $scope.doAction("AlertEnable", [AlertIdsArr, true], function(returnObj) {
              if(returnObj.code == 0) {
                var failObjTotal = returnObj.data.failObj.length;
                var successObjTotal = returnObj.data.successObj.length;
                growl.success("成功启用" + successObjTotal + "个,失败" + failObjTotal + "个", {});
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  var rowData = row.data();
                  rowData.enabled = true;
                  rowData.selected = false;
                  row.cells().invalidate().draw(false);
                  // var checkedBoxcells = nodes[i].cells;
                  // var selectcheckBox = nodes[i].cells[checkedBoxcells.length - 2];
                  // // $(selectcheckBox.children).attr("checked", "checked");
                  // $(selectcheckBox.children).prop("checked", true);
                }
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              } else if(!returnObj) {
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

        //多项停用
        $scope.selectedUnable = function() {
          var tableRows = table.rows({
            selected: true
          });
          var selectedCount = tableRows.count();
          var nodes = tableRows.nodes();
          if(selectedCount == 0) {
            growl.warning("当前没有选中的点检报告项", {});
            return;
          }
          var successCount = 0;
          var errorCount = 0;
          var AlertIdsArr = [];
          var ifGo = false; //这是之前前端判断失败成功个数的标志
          // var ifGo = true; //现在由后端判断失败和成功个数，这里就不需要判断ifGo了。故置成true
          for(var i = 0; i < nodes.length; i++) {
            var row = table.row(nodes[i]);
            var rowData = row.data();
            // AlertIdsArr.push(rowData.id);
            if(rowData.enabled) {
              AlertIdsArr.push(rowData.id);
              successCount++;
            } else {
              errorCount++;
            }
            if(selectedCount == (successCount + errorCount)) {
              ifGo = true;
            }
          };
          if(ifGo) {
            $scope.doAction("AlertEnable", [AlertIdsArr, false], function(returnObj) {
              if(returnObj.code == 0) {
                var failObjTotal = returnObj.data.failObj.length;
                var successObjTotal = returnObj.data.successObj.length;
                growl.success("成功停用" + successObjTotal + "个,失败" + failObjTotal + "个", {});
                for(var i = 0; i < nodes.length; i++) {
                  var row = table.row(nodes[i]);
                  var rowData = row.data();
                  rowData.enabled = false;
                  rowData.selected = false;
                  row.cells().invalidate().draw(false);
                  /*var checkedBoxcells = nodes[i].cells;
                  var selectcheckBox = nodes[i].cells[checkedBoxcells.length - 2];
                  $(selectcheckBox.children).removeAttr("checked");*/
                }

                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
                // $(".itemCheckBox").each(function() {
                //   $(this).attr("checked", false);
                // });
              } else if(!returnObj) {
                $(".itemCheckBox").each(function() {
                  $(this).attr("checked", false);
                });
                $("#allselect-btn").attr("checked", false);
                table.rows().deselect();
              }
            });
          }
        };

      }]

    }

  }]);



  //======================================    新增点检计划项次    ===================================================
  directives.initDirective('addItemTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {

        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var isEditing = false;
                var ifShow = false;
                $scope.$on(Event.ALERTRULESINIT + "_item", function(event, args) {

                    if(table) {
                        table.destroy();
                        domMain.empty();
                    }
                    isEditing = false;
                    table = domMain.DataTable({
                        dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        select: $.ProudSmart.datatable.select,
                        data: args.option[0],
                        order: [
                            [7, "desc"]
                        ],
                        columns: [$.ProudSmart.datatable.selectCol, {
                            data: "itemId",
                            title: "项次",
                            width: "5%"
                        }, {
                            data: "equipmentName",
                            title: "设备",
                            width: "8%"
                        }, {
                            data: "checkMessage",
                            title: "点检内容",
                            width: "10%"
                        }, {
                            data: "checkStandard",
                            title: "点检标准",
                            width: "30%"
                        }, {
                            data: "checkTool",
                            title: "点检工具",
                            width: "10%"
                        }, {
                            data: "checkMethod",
                            title: "点检方法",
                            width: "10%"
                        }, {
                            data: "risingTime",
                            title: "操作",
                            width: "10%",
                            visible: false
                        }, $.ProudSmart.datatable.optionCol3],
                        columnDefs: [{
                            "targets": 0,
                            "orderable": false,
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                if(type == "display") {
                                    if(data) {
                                        return '<input class="itemCheckBox" checked type="checkbox">';
                                    } else {
                                        return '<input class="itemCheckBox" type="checkbox">';
                                    }
                                }
                                return "";
                            }
                        }, {
                            targets: 1,
                            data: "itemId",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        }, {
                            targets: 2,
                            data: "equipmentName",
                            render: function(data, type, full) {


                                // if(full.isEdit == 2 && type == "display")
                                //     // return "<input maxlength='20' style='width:50%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                //     return "<select class='form-control input-sm'><option>设备1</option><option>设备2</option></select>";
                                // else {
                                //     return escape(data);
                                // }
                                return "<select style='width:80%' class='form-control input-sm'><option>设备1</option><option>设备2</option></select>";
                            }
                        }, {
                            targets: 3,
                            data: "checkMessage",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' id='checkMessage'>";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 4,
                            data: "checkStandard",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 5,
                            data: "checkTool",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 6,
                            data: "checkMethod",
                            render: function(data, type, full) {

                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 7,
                            data: "",
                            render: function(data, type, full) {
                               return escape(data);
                            }
                        }, {
                            "targets": 8,
                            "data": "option",
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                var str = '';
                                if(full.isEdit == 2) {
                                    str += '<div class="btn-group btn-group-sm">' +
                                        '<a id="save-button" class="btn btn-primary"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">确定</span></a>' +
                                        '<a id="cancel-button" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';
                                } else {
                                    str += '<div class="btn-group btn-group-sm">';
                                    if ($scope.menuitems['A02_S10']) {
                                        str += '<a id="edit-button" class="btn btn-primary"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">编辑</span></a>';
                                    }
                                    if ($scope.menuitems['A03_S10']) {
                                        str += '<a id="delect-button" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">删除</span></a></div>';
                                    }
                                }
                                return str;
                            }
                        }],
                        rowCallback: function(nRow, aData, iDataIndex) {
                            if(aData.selected) {
                                $(nRow).addClass("selected")
                            } else {
                                $(nRow).removeClass("selected")
                            }
                            $compile(nRow)($scope);
                        }
                    });
                });



                /**
                 * 保存新增项次
                 */
                domMain.on('click', '#save-button', function(e) {
                    e.stopPropagation();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var checkPass = true;

                    var itemids = $("#addCheckNumberTable").find("tr").length-1;

                    $.each(tr.children(), function(j, val1) {
                        var jqob1 = $(val1);

                        //把input变为字符串
                        if(!jqob1.has('button').length && jqob1.has('input').length) {
                            var txt = $.trim(jqob1.children("input").val());
                            if(txt) {
                                if(j == 1) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["itemId"] = txt;
                                }
                                if(j == 2) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["equipmentName"] = txt;
                                }
                                if(j == 3) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["checkMessage"] = txt;
                                }
                                if(j == 4) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["checkStandard"] = txt;
                                }
                                if(j == 5) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["checkTool"] = txt;
                                }
                                if(j == 6) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["checkMethod"] = txt;
                                }

                                $(val1).removeClass('danger');
                            } else {
                                $(val1).addClass('danger');
                                checkPass = false;
                                return false;
                            }
                        }
                    });
                    if(checkPass) {
                        row.data().itemId = itemids;
                        row.data().id = itemids;
                        $scope.doAction('saveCheckNumber', row.data(), function(returnObj) {
                            if(!returnObj) {
                                row.data().isEdit = 2;
                            } else {
                                row.data().isEdit = 0;
                                isEditing = false;
                                row.data().itemId = itemids;
                                row.data().id = itemids;
                                row.cells().invalidate().draw(false);
                            }
                        });
                    }
                });

                domMain.on('click', '#edit-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if(!isEditing) {
                        isEditing = true;
                        row.data().isEdit = 2;

                        row.cells().invalidate().draw(false);
                    } else {
                        if(row.data().isEdit == 0) {
                            growl.warning("当前有正编辑的点检项次", {});
                            return;
                        }
                    }
                    if(row.data().id == 0) {
                        growl.warning("当前有正编辑的点检项次", {});
                        return;
                    }
                });

                domMain.on('click', '#cancel-button', function(e) {

                    e.stopPropagation();
                    isEditing = false;
                    var row = table.row('.shown');
                    if(row.data()) {
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelCheckNumber', row.data());
                    } else {
                        var tr = $(this).closest('tr');
                        var row = table.row(tr);
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelCheckNumber', row.data());
                    }

                });

                domMain.on('click', '#delect-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);

                    $scope.doAction('deleteCheckNumber', row.data());
                    row.data().isEdit = 0;
                    row.remove().draw(false);
                });


                /**
                 * 勾选操作
                 */
                domMain.on('change', '#allselect-btn', function(e) {
                    e.stopPropagation();
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    if(e.target.checked) {
                        table.rows().select();
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = true;
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex == tableRows.count()) {
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex == tableRows.count()) {
                            $scope.abled = true;
                        } else {
                            $scope.unabled = true;
                            $scope.abled = true;
                            $scope.selectedCount = 0;
                        }
                        table.rows().invalidate().draw(false);
                        $scope.$apply();

                    } else {
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = false;
                        };
                        table.rows().deselect();
                        table.rows().invalidate().draw(false);
                        $scope.abled = false;
                        $scope.unabled = false;
                        $scope.selectedCount = 0;
                        $scope.$apply();

                    }
                });

                domMain.on('change', '.itemCheckBox', function(e) {
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    var tableRows = table.rows({
                        selected: true
                    });
                    if(e.target.checked) {
                        row.data().selected = true;
                        if(row.data().enabled) { //启用
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else {
                            $scope.abled = true;
                        }
                    } else {
                        row.data().selected = false;
                        var rows = table.rows();
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex > 0 && unabledIndex == 0) { //说明有启用,无停用
                            $scope.abled = false;
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex > 0 && abledIndex == 0) { //说明有停用,无启用
                            $scope.abled = true;
                            $scope.unabled = false;
                        }
                    }
                    if(tableRows.count() != table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', false)
                        $('#allselect-btn').prop('checked', false);
                    } else if(tableRows.count() == table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', true)
                        $('#allselect-btn').prop('checked', true);
                    }
                    $scope.$apply();
                });

                domMain.on('change', '.enabledCheckBox', function(e) {
                    var self = this;
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var param = [];
                    if(e.target.checked) {
                        row.data().enabled = true;
                        param = [
                            [row.data().id], true
                        ];
                    } else {
                        row.data().enabled = false;
                        param = [
                            [row.data().id], false
                        ];
                    }
                    $scope.doAction("AlertEnable", param, function(returnObj) {
                        if(returnObj.code == 0) {
                            table.rows().invalidate().draw(false);
                            if(!e.target.checked) {
                                $(self).prop("checked", false);
                                growl.success("停用成功", {});
                            } else {
                                $(self).attr("checked", true);
                                growl.success("启用成功", {});
                            }
                            $(".itemCheckBox").each(function() {
                                $(this).attr("checked", false);
                            });
                            $("#allselect-btn").attr("checked", false);
                            table.rows().deselect();
                        } else if(!returnObj) {
                            if(!e.target.checked) {
                                row.data().enabled = true;
                                $(self).prop("checked", true);
                            } else {
                                row.data().enabled = false;
                                $(self).attr("checked", false);
                            }
                        }
                    }, true);
                });



            }]

        }

    }]);



  //======================================    保养计划     ===========================================
  directives.initDirective('maintainPlanTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {

        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var ifShow = false;
                $scope.$on(Event.ALERTRULESINIT + "_maintainPlan", function(event, args) {
                    if(table) {
                        table.destroy();
                        domMain.empty();
                    }
                    table = domMain.DataTable({
                        dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        select: $.ProudSmart.datatable.select,
                        data: args.option[0],
                        order: [
                            [13, "desc"]
                        ],
                        columns: [$.ProudSmart.datatable.selectCol, {
                            data: "projectPosition",//厂部、车间、线体、设备名称
                            title: "设备位置"
                        }, {
                            data: "equipmentName",
                            title: "设备名称"
                        }, {
                            data: "projectNumber",
                            title: "设备编码"//不知道对应的字段
                        }, {
                            data: "projectName",
                            title: "保养计划名称"
                        }, {
                            data: "maintenancePlanNumber",
                            title: "保养计划编号"
                        }, {
                            data: "maintenanceName",
                            title: "保养类型"
                        }, {
                            data: "periodicUnitName",
                            title: "周期单位"
                        }, {
                            data: "periodicInterval",
                            title: "周期间隔"
                        }, {
                            data: "startDate",
                            title: "开始日期"
                        }, {
                            data: "startTime",
                            title: "开始时间"
                        }, {
                            data: "createUserName",
                            title: "制定人"
                        }, {
                            data: "planStatus",
                            title: "启用",
                            visible: $scope.menuitems['A13_S45'] ? true : false,
                            orderable: false
                        }, {
                            data: "risingTime",
                            title: "操作",
                            visible: false
                        }, $.ProudSmart.datatable.optionCol3],
                        columnDefs: [{
                            "targets": 0,
                            "orderable": false,
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                if(type == "display") {
                                    if(data) {
                                        return '<input class="itemCheckBox" checked type="checkbox">';
                                    } else {
                                        return '<input class="itemCheckBox" type="checkbox">';
                                    }
                                }
                                return "";
                            }
                        }, {
                            targets: 1,
                            data: "projectPosition",
                            render: function(data, type, full) {
                                //return escape(data);//厂部、车间、线体、设备名称

                                var data = "模组车间";
                                return data;
                            }
                        }, {
                            targets: 2,
                            data: "equipmentName",
                            render: function(data, type, full) {
                                var data = "注塑机";
                                return data;
                            }
                        }, {
                            targets: 3,
                            data: "projectNumber",
                            render: function(data, type, full) {
                                var data = "xxxxxxxx";
                                return data;
                            }
                        }, {
                            targets: 4,
                            data: "projectName",
                            render: function(data, type, full) {
                                var data = "xxxxxxxx";
                                return data;
                            }
                        }, {
                            targets: 5,
                            data: "maintenancePlanNumber",
                            render: function(data, type, full) {
                                var data = "xxxxxxxx";
                                return data;
                            }
                        }, {
                            targets: 6,
                            data: "maintenanceName",
                            render: function(data, type, full) {
                                var data = "日常保养";
                                return data;
                            }
                        }, {
                            targets: 7,
                            data: "periodicUnitName",
                            render: function(data, type, full) {
                                var str = "日月年";
                                return str;
                            }
                        }, {
                            targets: 8,
                            data: "periodicInterval",
                            render: function(data, type, full) {
                                var str = "1";
                                return str;
                            }
                        }, {
                            targets: 9,
                            data: "startDate",
                            render: function(data, type, full) {

                                var str = "2018.01.11";
                                return str;
                            }
                        }, {
                            targets: 10,
                            data: "startTime",
                            render: function(data, type, full) {
                                var str = "12:30";
                                return str;
                            }
                        }, {
                            targets: 11,
                            data: "createUserName",
                            render: function(data, type, full) {
                                var str = "阿飞";
                                return str;
                            }
                        }, {
                            targets: 12,
                            data: "planStatus",
                            visible: $scope.menuitems['A13_S45'] ? true : false,
                            render: function(data, type, full) {
                                if(type == "display") {
                                    if(data) {
                                        return '<input class="enabledCheckBox" checked type="checkbox">';
                                    } else {
                                        return '<input class="enabledCheckBox" type="checkbox" >';
                                    }
                                }
                                return "";
                            }
                        }, {
                            targets: 13,
                            data: "",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        }, {
                            "targets": 14,
                            "data": "option",
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                var str = "<div class='btn-group btn-group-sm'>";
                                if($scope.menuitems['A06_S45']) {
                                    str += "<button id='view-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 查看</span></button>";
                                }

                                if($scope.menuitems['A05_S45']) {
                                    str += "<button id='edit-btn' class='btn btn-primary' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 编辑</span></button>";
                                }
                                if($scope.menuitems['A04_S45']) {
                                    str += "<button id='del-btn' class='btn btn-default' ><i class='fa fa-save hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 删除</span></button>";
                                }
                                return str;
                            }
                        }],
                        rowCallback: function(nRow, aData, iDataIndex) {
                            if(aData.selected) {
                                $(nRow).addClass("selected")
                            } else {
                                $(nRow).removeClass("selected")
                            }
                            $compile(nRow)($scope);
                        }
                    });
                });

                /**
                 * 监听表格初始化后，添加按钮
                 */

                domMain.on('click', '#view-btn', function(e) {
                    e.preventDefault();
                    $scope.showView = true;

                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var rowData = row.data();
                    $scope.maintainplanAddData = {
                        "domainPath": rowData.domainPath,//数据域
                        "createUserId": rowData.createUserId,//创建人
                        "createUserName": rowData.createUserName,//创建人姓名
                        "updateUserName": rowData.updateUserName,//修改人姓名
                        "projectPosition": rowData.projectPosition,//设备位置
                        "projectName": rowData.projectName,//设备名称
                        "projectNumber": rowData.projectNumber,//设备编码
                        "maintainplanName": rowData.maintainplanName,//保养计划名称
                        "maintainplanNumber": rowData.maintainplanNumber,//保养计划编号
                        "maintainType": rowData.maintainType,//保养类型
                        "periodicUnitName": rowData.periodicUnitName,//周期单位
                        "periodicInterval": rowData.periodicInterval,//周期间隔
                        "startDate": rowData.startDate,//开始日期
                        "startTime": rowData.startTime,//开始时间
                        "planStatus": "1",//是否启用，默认关闭状态
                        "pointMaintainLists": rowData.pointMaintainLists,//保养项次
                        "id": rowData.id,

                    };
                    $scope.addMaintainPlan(rowData)

                });

                domMain.on('click', '#edit-btn', function(e) {

                    $scope.showView=false;
                    e.stopPropagation();
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var rowData = row.data();

                    $scope.maintainplanAddData = {
                        "createUserId": rowData.createUserId,//创建人
                        "createUserName": rowData.createUserName,//创建人姓名
                        "updateUserName": rowData.updateUserName,//修改人姓名
                        "projectPosition": rowData.projectPosition,//设备位置
                        "projectName": rowData.projectName,//设备名称
                        "projectNumber": rowData.projectNumber,//设备编码
                        "maintainplanName": rowData.maintainplanName,//保养计划名称
                        "maintainplanNumber": rowData.maintainplanNumber,//保养计划编号
                        "maintainType": rowData.maintainType,//保养类型
                        "periodicUnitName": rowData.periodicUnitName,//周期单位
                        "periodicInterval": rowData.periodicInterval,//周期间隔
                        "startDate": rowData.startDate,//开始日期
                        "startTime": rowData.startTime,//开始时间
                        "planStatus": "1",//是否启用，默认关闭状态
                        "pointMaintainLists": rowData.pointMaintainLists,//保养项次
                        "id": rowData.id,
                        "domainPath": rowData.domainPath
                    };
                    $scope.addMaintainPlan(rowData);
                });

                domMain.on('click', '#del-btn', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    $scope.doAction('delectMaintainPlan', row.data());
                });

                /**
                 * 勾选操作
                 */
                domMain.on('change', '#allselect-btn', function(e) {
                    e.stopPropagation();
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    if(e.target.checked) {
                        table.rows().select();
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = true;
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex == tableRows.count()) {
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex == tableRows.count()) {
                            $scope.abled = true;
                        } else {
                            $scope.unabled = true;
                            $scope.abled = true;
                            $scope.selectedCount = 0;
                        }
                        table.rows().invalidate().draw(false);
                        $scope.$apply();

                    } else {
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = false;
                        };
                        table.rows().deselect();
                        table.rows().invalidate().draw(false);
                        $scope.abled = false;
                        $scope.unabled = false;
                        $scope.selectedCount = 0;
                        $scope.$apply();

                    }
                });

                domMain.on('change', '.itemCheckBox', function(e) {
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    var tableRows = table.rows({
                        selected: true
                    });
                    if(e.target.checked) {
                        row.data().selected = true;
                        if(row.data().enabled) { //启用
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else {
                            $scope.abled = true;
                        }
                    } else {
                        row.data().selected = false;
                        var rows = table.rows();
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex > 0 && unabledIndex == 0) { //说明有启用,无停用
                            $scope.abled = false;
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex > 0 && abledIndex == 0) { //说明有停用,无启用
                            $scope.abled = true;
                            $scope.unabled = false;
                        }
                    }
                    if(tableRows.count() != table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', false)
                        $('#allselect-btn').prop('checked', false);
                    } else if(tableRows.count() == table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', true)
                        $('#allselect-btn').prop('checked', true);
                    }
                    $scope.$apply();
                });

                domMain.on('change', '.enabledCheckBox', function(e) {
                    var self = this;
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var param = [];
                    if(e.target.checked) {
                        row.data().enabled = true;
                        param = [
                            [row.data().id], true
                        ];
                    } else {
                        row.data().enabled = false;
                        param = [
                            [row.data().id], false
                        ];
                    }
                    $scope.doAction("AlertEnable", param, function(returnObj) {
                        if(returnObj.code == 0) {
                            table.rows().invalidate().draw(false);
                            if(!e.target.checked) {
                                $(self).prop("checked", false);
                                growl.success("停用成功", {});
                            } else {
                                $(self).attr("checked", true);
                                growl.success("启用成功", {});
                            }
                            $(".itemCheckBox").each(function() {
                                $(this).attr("checked", false);
                            });
                            $("#allselect-btn").attr("checked", false);
                            table.rows().deselect();
                        } else if(!returnObj) {
                            if(!e.target.checked) {
                                row.data().enabled = true;
                                $(self).prop("checked", true);
                            } else {
                                row.data().enabled = false;
                                $(self).attr("checked", false);
                            }
                        }
                    }, true);
                });

                //多项启用
                $scope.selectedEnable = function() {
                    var tableRows = table.rows({
                        selected: true
                    });
                    var selectedCount = tableRows.count();
                    var nodes = tableRows.nodes();
                    if(selectedCount == 0) {
                        growl.warning("当前没有选中的告警规则项", {});
                        return;
                    }
                    var successCount = 0;
                    var errorCount = 0;
                    var AlertIdsArr = [];
                    var ifGo = false; //这是之前前端判断失败成功个数的标志
                    // var ifGo = true; //现在由后端判断失败和成功个数，这里就不需要判断ifGo了。故置成true
                    for(var i = 0; i < nodes.length; i++) {
                        var row = table.row(nodes[i]);
                        var rowData = row.data();
                        // AlertIdsArr.push(rowData.id);
                        if(!rowData.enabled) {
                            AlertIdsArr.push(rowData.id);
                            successCount++;
                        } else {
                            errorCount++;
                        }
                        if(selectedCount == (successCount + errorCount)) {
                            ifGo = true;
                            // growl.success("成功确认" + successCount + "个,失败" + errorCount + "个", {});
                        }
                    };
                    if(ifGo) {
                        $scope.doAction("AlertEnable", [AlertIdsArr, true], function(returnObj) {
                            if(returnObj.code == 0) {
                                var failObjTotal = returnObj.data.failObj.length;
                                var successObjTotal = returnObj.data.successObj.length;
                                growl.success("成功启用" + successObjTotal + "个,失败" + failObjTotal + "个", {});
                                for(var i = 0; i < nodes.length; i++) {
                                    var row = table.row(nodes[i]);
                                    var rowData = row.data();
                                    rowData.enabled = true;
                                    rowData.selected = false;
                                    row.cells().invalidate().draw(false);
                                    // var checkedBoxcells = nodes[i].cells;
                                    // var selectcheckBox = nodes[i].cells[checkedBoxcells.length - 2];
                                    // // $(selectcheckBox.children).attr("checked", "checked");
                                    // $(selectcheckBox.children).prop("checked", true);
                                }
                                $("#allselect-btn").attr("checked", false);
                                table.rows().deselect();
                            } else if(!returnObj) {
                                $(".itemCheckBox").each(function() {
                                    $(this).attr("checked", false);
                                });
                                $("#allselect-btn").attr("checked", false);
                                table.rows().deselect();
                            }
                        });
                    }
                };

                //多项停用
                $scope.selectedUnable = function() {
                    var tableRows = table.rows({
                        selected: true
                    });
                    var selectedCount = tableRows.count();
                    var nodes = tableRows.nodes();
                    if(selectedCount == 0) {
                        growl.warning("当前没有选中的告警规则项", {});
                        return;
                    }
                    var successCount = 0;
                    var errorCount = 0;
                    var AlertIdsArr = [];
                    var ifGo = false; //这是之前前端判断失败成功个数的标志
                    // var ifGo = true; //现在由后端判断失败和成功个数，这里就不需要判断ifGo了。故置成true
                    for(var i = 0; i < nodes.length; i++) {
                        var row = table.row(nodes[i]);
                        var rowData = row.data();
                        // AlertIdsArr.push(rowData.id);
                        if(rowData.enabled) {
                            AlertIdsArr.push(rowData.id);
                            successCount++;
                        } else {
                            errorCount++;
                        }
                        if(selectedCount == (successCount + errorCount)) {
                            ifGo = true;
                        }
                    };
                    if(ifGo) {
                        $scope.doAction("AlertEnable", [AlertIdsArr, false], function(returnObj) {
                            if(returnObj.code == 0) {
                                var failObjTotal = returnObj.data.failObj.length;
                                var successObjTotal = returnObj.data.successObj.length;
                                growl.success("成功停用" + successObjTotal + "个,失败" + failObjTotal + "个", {});
                                for(var i = 0; i < nodes.length; i++) {
                                    var row = table.row(nodes[i]);
                                    var rowData = row.data();
                                    rowData.enabled = false;
                                    rowData.selected = false;
                                    row.cells().invalidate().draw(false);
                                    /*var checkedBoxcells = nodes[i].cells;
                                    var selectcheckBox = nodes[i].cells[checkedBoxcells.length - 2];
                                    $(selectcheckBox.children).removeAttr("checked");*/
                                }

                                $("#allselect-btn").attr("checked", false);
                                table.rows().deselect();
                                // $(".itemCheckBox").each(function() {
                                //   $(this).attr("checked", false);
                                // });
                            } else if(!returnObj) {
                                $(".itemCheckBox").each(function() {
                                    $(this).attr("checked", false);
                                });
                                $("#allselect-btn").attr("checked", false);
                                table.rows().deselect();
                            }
                        });
                    }
                };

            }]

        }

    }]);


  //======================================    新增保养计划项次    ===================================================
  directives.initDirective('addMaintainItemTable', ['$timeout', 'ngDialog', '$compile', '$filter', 'growl', function($timeout, ngDialog, $compile, $filter, growl) {

        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var domMain = $element;
                var table;
                var isEditing = false;
                var ifShow = false;
                $scope.$on(Event.ALERTRULESINIT + "_maintainItem", function(event, args) {

                    if(table) {
                        table.destroy();
                        domMain.empty();
                    }
                    isEditing = false;
                    table = domMain.DataTable({
                        dom: args.option && args.option[0].length >= 1 ? $.ProudSmart.datatable.footerdom : '',
                        language: $.ProudSmart.datatable.language,
                        select: $.ProudSmart.datatable.select,
                        data: args.option[0],
                        order: [
                            [6, "desc"]
                        ],
                        columns: [$.ProudSmart.datatable.selectCol, {
                            data: "itemId",
                            title: "项次",
                            width: "5%"
                        }, {
                            data: "maintenance",
                            title: "保养内容",
                            width: "20%"
                        }, {
                            data: "maintenanceStandard",
                            title: "保养标准",
                            width: "35%"
                        }, {
                            data: "maintenanceTool",
                            title: "保养工具",
                            width: "10%"
                        }, {
                            data: "inspectionMode",
                            title: "检查方法",
                            width: "10%"
                        }, {
                            data: "risingTime",
                            title: "操作",
                            width: "8%",
                            visible: false
                        }, $.ProudSmart.datatable.optionCol3],
                        columnDefs: [{
                            "targets": 0,
                            "orderable": false,
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                if(type == "display") {
                                    if(data) {
                                        return '<input class="itemCheckBox" checked type="checkbox">';
                                    } else {
                                        return '<input class="itemCheckBox" type="checkbox">';
                                    }
                                }
                                return "";
                            }
                        }, {
                            targets: 1,
                            data: "itemId",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        }, {
                            targets: 2,
                            data: "maintenance",
                            render: function(data, type, full) {


                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 3,
                            data: "maintenanceStandard",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' id='checkMessage'>";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 4,
                            data: "maintenanceTool",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 5,
                            data: "inspectionMode",
                            render: function(data, type, full) {
                                //返回自定义名字
                                if(full.isEdit == 2 && type == "display")
                                    return "<input maxlength='20' style='width:80%' autocomplete='off' class='form-control input-sm' type='text' value='" + escape(data) + "' >";
                                else {
                                    return escape(data);
                                }
                            }
                        }, {
                            targets: 6,
                            data: "",
                            render: function(data, type, full) {

                                return escape(data);
                            }
                        }, {
                            "targets": 7,
                            "data": "option",
                            "render": function(data, type, full) {
                                // 返回自定义内容
                                var str = '';
                                if(full.isEdit == 2) {
                                    str += '<div class="btn-group btn-group-sm">' +
                                        '<a id="save-button" class="btn btn-primary"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">确定</span></a>' +
                                        '<a id="cancel-button" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">取消</span></a></div>';
                                } else {
                                    str += '<div class="btn-group btn-group-sm">';
                                    if ($scope.menuitems['A02_S10']) {
                                        str += '<a id="edit-button" class="btn btn-primary"><i class="fa fa-check  hidden-lg hidden-md hidden-sm "></i><span class="hidden-xs ng-binding">编辑</span></a>';
                                    }
                                    if ($scope.menuitems['A03_S10']) {
                                        str += '<a id="delect-button" class="btn btn-default" ><i class="fa fa-close hidden-lg hidden-md hidden-sm"></i><span class="hidden-xs ng-binding">删除</span></a></div>';
                                    }
                                }
                                return str;
                            }
                        }],
                        rowCallback: function(nRow, aData, iDataIndex) {
                            if(aData.selected) {
                                $(nRow).addClass("selected")
                            } else {
                                $(nRow).removeClass("selected")
                            }
                            $compile(nRow)($scope);
                        }
                    });
                });



                /**
                 * 保存新增项次
                 */
                domMain.on('click', '#save-button', function(e) {
                    e.stopPropagation();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var checkPass = true;

                    var itemids = $("#addMaintainNumberTable").find("tr").length-1;

                    $.each(tr.children(), function(j, val1) {
                        var jqob1 = $(val1);

                        //把input变为字符串
                        if(!jqob1.has('button').length && jqob1.has('input').length) {
                            var txt = $.trim(jqob1.children("input").val());
                            if(txt) {
                                if(j == 1) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["itemId"] = txt;
                                }
                                if(j == 2) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["maintenance"] = txt;
                                }
                                if(j == 3) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["maintenanceStandard"] = txt;
                                }
                                if(j == 4) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["maintenanceTool"] = txt;
                                }
                                if(j == 5) {
                                    table.cell(jqob1).data(txt);
                                    row.data()["inspectionMode"] = txt;
                                }


                                $(val1).removeClass('danger');
                            } else {
                                $(val1).addClass('danger');
                                checkPass = false;
                                return false;
                            }
                        }
                    });
                    if(checkPass) {

                        row.data().itemId = itemids;
                        row.data().id = itemids;
                        $scope.doAction('saveMaintainNumber', row.data(), function(returnObj) {
                            if(!returnObj) {
                                row.data().isEdit = 2;
                            } else {
                                row.data().isEdit = 0;
                                isEditing = false;
                                row.data().itemId = itemids;
                                row.data().id = itemids;
                                row.cells().invalidate().draw(false);
                            }
                        });
                    }
                });

                domMain.on('click', '#edit-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    if(!isEditing) {
                        isEditing = true;
                        row.data().isEdit = 2;

                        row.cells().invalidate().draw(false);
                    } else {
                        if(row.data().isEdit == 0) {
                            growl.warning("当前有正编辑的保养项次", {});
                            return;
                        }
                    }
                    if(row.data().id == 0) {
                        growl.warning("当前有正编辑的保养项次", {});
                        return;
                    }
                });

                domMain.on('click', '#cancel-button', function(e) {

                    e.stopPropagation();
                    isEditing = false;
                    var row = table.row('.shown');
                    if(row.data()) {
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelMaintainNumber', row.data());
                    } else {
                        var tr = $(this).closest('tr');
                        var row = table.row(tr);
                        row.data()["isEdit"] = 0;
                        ifShow = false;
                        $scope.doAction('cancelMaintainNumber', row.data());
                    }

                });

                domMain.on('click', '#delect-button', function(e) {
                    e.preventDefault();
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);

                    $scope.doAction('deleteMaintainNumber', row.data());
                    row.data().isEdit = 0;
                    row.remove().draw(false);
                });


                /**
                 * 勾选操作
                 */
                domMain.on('change', '#allselect-btn', function(e) {
                    e.stopPropagation();
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    if(e.target.checked) {
                        table.rows().select();
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = true;
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex == tableRows.count()) {
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex == tableRows.count()) {
                            $scope.abled = true;
                        } else {
                            $scope.unabled = true;
                            $scope.abled = true;
                            $scope.selectedCount = 0;
                        }
                        table.rows().invalidate().draw(false);
                        $scope.$apply();

                    } else {
                        var tableRows = table.rows({
                            selected: true
                        });
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            row.data().selected = false;
                        };
                        table.rows().deselect();
                        table.rows().invalidate().draw(false);
                        $scope.abled = false;
                        $scope.unabled = false;
                        $scope.selectedCount = 0;
                        $scope.$apply();

                    }
                });

                domMain.on('change', '.itemCheckBox', function(e) {
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var abledIndex = 0;
                    var unabledIndex = 0;
                    var tableRows = table.rows({
                        selected: true
                    });
                    if(e.target.checked) {
                        row.data().selected = true;
                        if(row.data().enabled) { //启用
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else {
                            $scope.abled = true;
                        }
                    } else {
                        row.data().selected = false;
                        var rows = table.rows();
                        for(var i = 0; i < tableRows.nodes().length; i++) {
                            var row = table.row(tableRows.nodes()[i]);
                            if(row.data().enabled) { //启用
                                abledIndex++;
                            } else { //停用
                                unabledIndex++;
                            }
                        };
                        if(abledIndex > 0 && unabledIndex == 0) { //说明有启用,无停用
                            $scope.abled = false;
                            $scope.unabled = true;
                            $scope.selectedCount = 0;
                        } else if(unabledIndex > 0 && abledIndex == 0) { //说明有停用,无启用
                            $scope.abled = true;
                            $scope.unabled = false;
                        }
                    }
                    if(tableRows.count() != table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', false)
                        $('#allselect-btn').prop('checked', false);
                    } else if(tableRows.count() == table.rows()[0].length) {
                        $('#allselect-btn').attr('checked', true)
                        $('#allselect-btn').prop('checked', true);
                    }
                    $scope.$apply();
                });

                domMain.on('change', '.enabledCheckBox', function(e) {
                    var self = this;
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    var param = [];
                    if(e.target.checked) {
                        row.data().enabled = true;
                        param = [
                            [row.data().id], true
                        ];
                    } else {
                        row.data().enabled = false;
                        param = [
                            [row.data().id], false
                        ];
                    }
                    $scope.doAction("AlertEnable", param, function(returnObj) {
                        if(returnObj.code == 0) {
                            table.rows().invalidate().draw(false);
                            if(!e.target.checked) {
                                $(self).prop("checked", false);
                                growl.success("停用成功", {});
                            } else {
                                $(self).attr("checked", true);
                                growl.success("启用成功", {});
                            }
                            $(".itemCheckBox").each(function() {
                                $(this).attr("checked", false);
                            });
                            $("#allselect-btn").attr("checked", false);
                            table.rows().deselect();
                        } else if(!returnObj) {
                            if(!e.target.checked) {
                                row.data().enabled = true;
                                $(self).prop("checked", true);
                            } else {
                                row.data().enabled = false;
                                $(self).attr("checked", false);
                            }
                        }
                    }, true);
                });



            }]

        }

    }]);

});



