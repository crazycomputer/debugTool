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
angular.module('serviceCenter.restTool', [])
    .controller('restToolController', ['$scope', '$state',
        '$stateParams', 'httpService', 'apiConstant', 'commonService', function ($scope, $state, $stateParams, httpService, apiConstant, commonService) {
            $scope.selectMethod = function (method) {
                if ($scope.restMethod == null || $scope.restMethod == '' || $scope.restMethod == undefined || $scope.restMethod == "null") {
                    $scope.restMethod = "get";
                    return
                }
                $scope.restMethod = method;
                console.log($scope.restMethod)
                console.log($scope.url)
            };
            $scope.selectProtocol = function (restProtocol) {
                if ($scope.restProtocol == null || $scope.restProtocol == '' || $scope.restProtocol == undefined || $scope.restProtocol == "null") {
                    $scope.restProtocol = "cse";
                    return
                }
                $scope.restProtocol = restProtocol;

            };
            $scope.Authorization = function () {
                $state.go('sc.rest.auth')
            }
            $scope.Headers = function () {
                $state.go('sc.rest.headers')
            }
            $scope.Content = function () {
                $state.go('sc.rest.content')
            }
            $scope.Raw = function () {
                $state.go('sc.rest.raw')
            }
            $scope.getActiveTab = function () {
                if ($state.current.name == "sc.rest.auth") {
                    $scope.selectedTab = 0;
                }
                if ($state.current.name == "sc.rest.headers") {
                    $scope.selectedTab = 1;
                }
                if ($state.current.name == "sc.rest.content") {
                    $scope.selectedTab = 2;
                }
                if ($state.current.name == "sc.rest.raw") {
                    $scope.selectedTab = 3;
                }

            }
            $scope.getActiveTab();
        }]);