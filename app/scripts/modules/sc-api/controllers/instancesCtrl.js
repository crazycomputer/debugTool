/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
angular.module('serviceCenter.instances', [])
    .controller('instancesController', ['$scope', 'httpService', 'apiConstant', 'commonService', function($scope, httpService, apiConstant, commonService) {
        $scope.appList = 'fetching';
        $scope.instanceList = 'instanceList';
        $scope.rowsPerPage = [5, 10];

        $scope.tableHeaders = [
            {
                'key': 'serviceId'
            },
            {
                'key': 'instanceId'
            },
            {
                'key': 'appId'
            },
            {
                'key': 'serviceName'
            },

            {
                'key': 'version'
            },
            {
                'key': 'property'
            },
            {
                'key': 'createdAt'
            },
            {
                'key': 'address'
            },
            {
                'key': 'modTime'
            },
            {
                'key': 'modRevision'
            },
            {
                'key': 'instanceHostName'
            }
        ];

        $scope.refreshAppList = function() {
            $scope.getServices();
        }

        $scope.getServices = function(appId) {
            angular.element(document.querySelector('.fa-refresh')).addClass('fa-spin');
            $scope.instances = [];
            var url = apiConstant.api.allServices.url;
            var method = apiConstant.api.allServices.method;
            httpService.apiRequest(url, method).then(function(response) {
                angular.element(document.querySelector('.fa-refresh')).removeClass('fa-spin');
                if (response && response.data && response.data.allServicesDetail && response.data.allServicesDetail.length > 0) {
                    $scope.appList = '';
                    angular.forEach(response.data.allServicesDetail, function(service) {
                        if (service.instances) {
                            console.log(service.instances)
                            angular.forEach(service.instances, function(instance) {
                                var obj = {
                                    serviceId: instance.serviceId,
                                    instanceId: instance.instanceId,
                                    appId: service.microService.appId,
                                    service: service.microService.serviceName,
                                    version: instance.version,
                                    properties: instance.properties,
                                    createdAt: commonService.timeFormat(instance.timestamp),
                                    address: instance.endpoints,
                                    modTimestamp:commonService.timeFormat(instance.modTimestamp),
                                    modRevision:instance.modRevision,
                                    instanceHostName: instance.hostName,
                                }
                                $scope.instances.push(obj);
                            });
                        }
                    })
                } else {
                    $scope.appList = 'empty';
                }
            }, function(error) {
                $scope.appList = 'failed';
                angular.element(document.querySelector('.fa-refresh')).removeClass('fa-spin');
            });
        }
        $scope.getServices();

    }]);