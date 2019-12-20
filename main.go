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
package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"net/url"
	"strconv"
)

type Config struct {
	frontendAddr string
	scAddr       string
}

var (
	namespace *string
	port      *int
)

func init() {
	namespace = flag.String("namespace", "", "namespace for this project")
	port = flag.Int("port", 30103, "frontend port to serve on")
}
func main() {
	flag.Parse()
	var addrs []string
	var err error
	if namespace != nil && len(*namespace) != 0 {
		scDomain := fmt.Sprintf("cse-service-center.%s.svc.cluster.local", *namespace)
		addrs, err = net.LookupHost(scDomain)
		if err != nil || len(addrs) == 0 {
			log.Printf("lookup domain successfully, %s to %#v", scDomain, addrs)
		}
	}
	// command line flags\
	cfg := Config{}
	if len(addrs) != 0 {
		cfg.scAddr = fmt.Sprintf("https://%s/", net.JoinHostPort(url.PathEscape(addrs[0]), "30100"))
	}else {
		cfg.scAddr = fmt.Sprintf("http://%s/", net.JoinHostPort(url.PathEscape("127.0.0.1"), "30100"))
	}
	cfg.frontendAddr = net.JoinHostPort("", strconv.Itoa(*port))
	// run frontend web server
	Serve(cfg)
}
