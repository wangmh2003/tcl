define(['directives/directives', 'bootstrap-dialog', 'datatables.net', 'datatables.net-bs', 'datatables.net-select'],
  function (directives, BootstrapDialog, datatables) {

    directives.initDirective('workOrderRecord', ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var state = "";
            $scope.$on(Event.WORKORDERRECORDINIT, function (event, args) {
              if (table) {
                table.destroy();
                domMain.empty();
              }
              state = args.state;
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                data: args.data,
                columns: args.columns,
                "order": [6, "desc"],
                columnDefs: args.columnDefs
              });
            });
            domMain.on('click', '#process', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var dataList = row.data();
              // location.href = "../app-flowsheet/index.html#/processView/" + dataList.id
              location.href = "#/workOrderTimeLine/" + dataList.ticketNo + "";
            });
            domMain.on('click', '#history', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var dataList = row.data();

            });
            domMain.on('click', '#execute', function (e) {
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var dataList = row.data();
              var name = $(this).text();
              if (($scope.menuitems['A03_S08'] || $scope.menuitems['A02_S09'])) {
                $scope.herfList(name, dataList, '');
              }
            });
            /*   domMain.on('click', 'td', function(e) {
                 e.preventDefault();
                 var name = $(this).text();
                 var tr = $(this).closest('tr');
                 var row = table.row(tr);
                 var dataList = row.data();
                 var sear='执行历史';
                  if(($scope.menuitems['A03_S08'] || $scope.menuitems['A02_S09']) && name.indexOf(sear) == -1){
                   $scope.herfList(name, dataList, state);
                  }
               });*/
          }
        ]
      }
    }]);
    directives.initDirective('historyTable', ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;
            // $scope.$on(Event.CMDBINFOSINIT+"_shadows", function(event, args) {
            $scope.$on(Event.WORKORDERRECORDINIT + "_history", function (event, args) {
              if (table) {
                table.destroy();
              }
              isEditing = false;
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                data: args.data,
                columns: args.columns,
                columnDefs: args.columnDefs
              });
            });
          }
        ]
      };
    }]);

    directives.initDirective('partTable', ['$compile', function ($compile) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          var domMain = $element;
          var type = $attrs.type;
          var table;
          $scope.$on("WorkOrderSelectPart", function (event, args) {
            if ($attrs.name && $attrs.name == args.name) {
              initTable(args);
            }
          });

          function initTable(args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }
            var name = args.name;
            var option = {
              dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data
            };
            switch (name) {
              case 'page':
                option.columns = [{
                  title: "配件名称",
                  data: "label",
                  orderable: false
                }, {
                  title: "配件编码",
                  data: "code",
                  orderable: false
                }, {
                  title: "数量",
                  data: "count",
                  orderable: false
                }];
                if (type != 'order') {
                  option.columns.push({
                    title: "操作",
                    data: "operate",
                    orderable: false
                  });
                }
                option.columnDefs = [{
                  "targets": 0,
                  "data": "label"
                }, {
                  "targets": 1,
                  "data": "code"
                }, {
                  "targets": 2,
                  "data": "count"
                }];
                if (type != 'order') {
                  option.columnDefs.push({
                    "targets": 3,
                    "data": "operate",
                    render: function () {
                      var str = '<div class="btn-group">';
                      str += '<button id="del-btn" type="button" class="btn btn-default btn-sm" ' + (!$scope.myObj.ticketStatus || $scope.detail.taskStatus == 200 ? ' disabled ' : '') + '>' +
                        '<i class="fa fa-times hidden-lg hidden-md hidden-sm"></i>' +
                        '<span class="hidden-xs"> 删除</span></a>';
                      str += '</div>';
                      return str;
                    }
                  });
                }
                break;
              case 'dialog':
                option.order = [[1, "asc"]];
                option.columns = [{
                  title: "配件名称",
                  data: "label"
                }, {
                  title: "配件编码",
                  data: "code"
                }, {
                  title: "库存数量",
                  data: "inventory"
                }, {
                  title: "数量",
                  data: "count"
                }];
                option.columnDefs = [{
                  "targets": 0,
                  "data": "label"
                }, {
                  "targets": 1,
                  "data": "code"
                }, {
                  "targets": 2,
                  "data": "inventory"
                }, {
                  "targets": 3,
                  "data": "count",
                  render: function (value) {
                    var str = '<input type="text" value="' + (value || 0) + '" />';
                    return str;
                  }
                }];
                break;
            }
            table = domMain.DataTable(option);
          }

          domMain.on('change', 'input', function (e) {
            e.stopPropagation();
            var $input = $(this);
            var tr = $input.closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.partList.forEach(function (item) {
              if (item.id == rowData.id && item.code == rowData.code) {
                item.count = $input.val();
              }
            });
            $scope.$apply();
          });

          /*domMain.on('click', 'tr', function (e) {
            var $tr = $(this);
            if ($tr.find('th').length > 0) {
              return;
            }
            var tableRows = table.rows();
            for (var i = 0; i < tableRows.nodes().length; i++) {
              var row = table.row(tableRows.nodes()[i]);
              var $row = $(tableRows.nodes()[i]);
              $row.removeClass("selected");
              row.data().selected = false;
              if ($row[0] === $tr[0]) {
                $row.addClass("selected");
                row.data().selected = true;
              }
              $scope.$apply()
            }

          });*/

          domMain.on('click', '#del-btn', function (e) {
            e.stopPropagation();
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            $scope.deleteSelectPart(rowData, function () {
              row.remove().draw();
            });
          });

        }]
      };
    }]);

    directives.initDirective('faultKnowledgeTable', ['$timeout', '$compile', '$filter', function ($timeout, $compile, $filter) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          var domMain = $element;
          var table;

          $scope.$on(Event.FAULTKNOWLEDGEINIT, function (event, args) {
            if (table) {
              table.destroy();
              domMain.empty();
            }

            $scope.selectedFaultKnowledge = null;

            table = domMain.DataTable({
              dom: args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
              language: $.ProudSmart.datatable.language,
              data: args.data,
              order: [
                [0, "asc"]
              ],
              columns: [{
                data: "faultNo",
                title: "故障编号"
              }, {
                data: "label",
                title: "故障名称"
              }, {
                data: "category",
                title: "故障类别"
              }, {
                data: "desc",
                title: "关联设备"
              }],
              columnDefs: [{
                targets: 0,
                data: "faultNo"
              }, {
                targets: 1,
                data: "label"
              }, {
                targets: 2,
                data: "category"
              }, {
                targets: 3,
                data: "desc"
              }]
            });
          });

          function format(d) {
            var returnStr;
            returnStr = '<table width="100%" class="table table-inner">';
            for (var i in d) {
              returnStr += '<tr role="row">';
              if (i == 'phenomenon') {
                returnStr += '<td style="width:19%;">故障现象:</td>';
                returnStr += '<td><div style="width: 90%;height:auto;">' + d.phenomenon + '</div></td>';
              } else if (i == 'cause') {
                returnStr += '<td style="width:19%;">产生原因:</td>';
                returnStr += '<td><div style="width: 90%;height:auto;">' + d.cause + '</div></td>';
              } else if (i == 'processingMethod') {
                returnStr += '<td style="width:19%;">处理方法:</td>';
                returnStr += '<td><div style="width: 90%;height:auto;">' + d.processingMethod + '</div></td>';
              }
              returnStr += '</tr>';
            }
            returnStr += '</table>';
            return returnStr;
          }

          domMain.on('click', 'td', function (e) {
            e.preventDefault();
            var checkbox = $(this).find('input[type=checkbox]');
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            var rowData = row.data();
            var tableData = table.data();
            var trs = tableData.rows().nodes();

            for (var i = 0; i < tableData.length; i++) {
              tableData[i].selected = false;
            }
            for (var i = 0; i < trs.length; i++) {
              $(trs[i]).removeClass('selected');
            }
            rowData.selected = true;
            tr.addClass('selected');

            $scope.$apply(function () {
              $scope.selectedFaultKnowledge = rowData;
            });

            if (rowData) {
              if (row.child.isShown()) { //之前展开
                row.child.hide();
                tr.removeClass('shown');
              } else { //之前关闭，则需要展开
                // Open this row
                var data = row.data();
                row.child(format(rowData)).show();
                tr.addClass('shown');
              }
            }
          });
        }]
      }
    }])

    //处理任务---关联备件
    directives.initDirective('majorDeviceTable', ['$timeout', '$compile', function ($timeout, $compile) {
      return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
          function ($scope, $element, $attrs) {
            var domMain = $element;
            var table;
            var isEditing = false;

            $scope.$on(Event.WORKORDERRECORDINIT + "_deviceTask", function (event, args) {
              if (table) {
                table.destroy();
              }

              isEditing = false;
              table = domMain.DataTable({
                dom: args.data && args.data.length > 0 ? $.ProudSmart.datatable.footerdom : '',
                language: $.ProudSmart.datatable.language,
                data: args.data,
                rowCallback: function (nRow, aData, iDataIndex) {
                  $compile(nRow)($scope);
                },
                columns: [{
                  title: "备件编号",
                  data: "name",
                  orderable: false
                }, {
                  title: "备件名称",
                  data: "label",
                  orderable: false
                }, {
                  title: "数量",
                  data: "stockNumber",
                  orderable: false
                }, {
                  title: "操作",
                  visible: $scope.detail.taskStatus != 200,
                  data: "option",
                  orderable: false
                }],
                columnDefs: [{
                  "targets": 0,
                  "data": "name",
                  "render": function (data, type, full) {
                    // 返回自定义内容
                    var str = "";
                    if (full.isEdit == 3 && type == "display") {
                      str += '<select id="allSpare" name="allSpare" class="combobox form-control input-sm" ng-model="definitions.selectList" ng-change="saveAttachment(definitions.selectList);" ng-options="pro as pro.name for  pro in selectList.allSpareParts">';
                      str += '<option value="">请选择...</option>';
                      str += '</select>';
                    } else {
                      str = "<a href='#sparepartInfo/" + full.id + "'>" + data + "</a>";
                    }
                    return str;
                  }
                }, {
                  "targets": 1,
                  "data": "label",
                  "render": function (data, type, full) {
                    return data;
                  }
                }, {
                  "targets": 2,
                  "data": "stockNumber",
                  "render": function (data, type, full) {
                    if (full.isEdit > 0 && type == "display") {
                      return data;
                    } else {
                      if ($scope.detail.taskStatus != 200) {
                        if ($scope.sparePartsArray[full.id] != undefined) {
                          return "<input class='form-control col-xs-6'  name='" + full.id + "' id='stockName'  type='text'  maxlength='20'  value='" + full.editNumber + "'  style='border: 1px solid #F18282;width: 100%;' placeholder='当前库存数量：" + $scope.sparePartsArray[full.id].stockNumber + "'>";
                        } else {
                          return "<input class='form-control col-xs-6'  name='" + full.id + "' id='stockName' type='text'  maxlength='20'  style='border: 1px solid #F18282;width: 100%;' placeholder='当前库存数量：" + data + "'>";
                        }
                      } else {
                        return data;
                      }
                    }
                  }
                }, {
                  "targets": 3,
                  "data": "option",
                  "render": function (data, type, full) {
                    // 返回自定义内容
                    var str = "<div class='btn-group ' >";
                    //if (full.isEdit == 3) {
                    //  str += "<a id='save-btn' class='btn btn-default btn-sm' style='margin-right: 10px;'><i class='fa fa-save  hidden-lg hidden-md hidden-sm'></i><span class='hidden-xs'> 保存</span></a>";
                    //  str += "<a id='cancel-btn' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 取消</span></a>";
                    //} else {
                    if ($scope.detail.taskStatus != 200 && full.isEdit != 3) {
                      str += "<a id='del-btn' ng-show='detail.taskStatus != 200' class='btn btn-default btn-sm' ><i class='fa fa-times hidden-lg hidden-md hidden-sm '></i><span class='hidden-xs'> 删除</span></a>";
                    }
                    //}
                    str += "</div>";
                    return str;
                  }
                }]
              });
            });
            ///**
            // * 监听表格初始化后，添加按钮
            // */
            //domMain.on('init.dt', function () {
            //  var parentDom = $(".special-btn").parent();
            //  parentDom.html('<a ng-click="addAttachment()" ng-show="detail.taskStatus != 200 && selectList.ticketStatus != false " class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 选择备件</span></a>');
            //  $compile(parentDom)($scope);
            //});
            /**
             * 监听表格初始化后，添加按钮
             */
            domMain.on('init.dt', function () {
              /*  var parentDom = $(".special-btn").parent();
                //          parentDom.html('<a ng-click="addFault()" class="btn btn-default btn-sm"><i class="fa fa-plus"></i><span class="hidden-xs"> 添加故障</span></a>');
                if($scope.detail.taskStatus != 200 && $scope.selectList.ticketStatus != false ){
                  parentDom.html('<select class="form-control" style="min-width:200px" selectdata="allSpareParts" itemchange="saveAttachment" select2></select>');
                }
                $compile(parentDom)($scope);*/
            });
            domMain.on('click', '#save-btn', function (e) {
              e.stopPropagation();
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              var rowData = row.data();
              var divs2 = $scope.selectList.allSpareParts;

              var put = $("#allSpare option:selected").val();
              if (put == "" && put == null) {
                return;
              } else {
                for (var i in divs2) {
                  if (divs2[i].id == put) {
                    $scope.saveAttachment(divs2[i]);
                    break;
                  }

                }
              }
            });

            domMain.on('click', '#cancel-btn', function (e) {
              e.stopPropagation();
              isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.cancelAttach(row.data());
            });
            domMain.on('click', '#del-btn', function (e) {
              e.stopPropagation();
              isEditing = false;
              var tr = $(this).closest('tr');
              var row = table.row(tr);
              $scope.cancelAttach(row.data());
            });


          }
        ]
      }
    }]);
  });
