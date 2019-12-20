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
	"debugTool/util"
	"os"
	"path/filepath"

	//static "github.com/Code-Hex/echo-static"
	//assetfs "github.com/elazarl/go-bindata-assetfs"
	//"debugTool/asset"
	"log"
	"net/http"
	"net/url"

	//"os"
	//"path/filepath"
	"debugTool/schema"
	//assetfs "github.com/elazarl/go-bindata-assetfs"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func Serve(c Config) {

	e := echo.New()
	e.HideBanner = true

	//编译构建时
	//fs := assetfs.AssetFS{
	//	Asset:     asset.Asset,
	//	AssetDir:  asset.AssetDir,
	//	AssetInfo: asset.AssetInfo,
	//}
	//e.Use(static.ServeRoot("/", &fs))

	dir, err := os.Getwd()
	if err != nil {
		log.Fatalf("Cant get cwd, error:%s", err)
	}
	staticPath := filepath.Join(dir, "app")
	e.Static("/", staticPath)

	e.Any("/testSchema/*", schema.SchemaHandleFunc)

	scProxy(c, e)

	log.Printf("Error: %s", e.Start(c.frontendAddr))
}

// setup proxy for requests to service center
func scProxy(c Config, e *echo.Echo) {
	scUrl, err := url.Parse(c.scAddr)
	if err != nil {
		log.Fatalf("Error parsing service center address:%s, err:%s", c.scAddr, err)
	}

	targets := []*middleware.ProxyTarget{
		{
			URL: scUrl,
		},
	}
	g := e.Group("/sc")
	balancer := middleware.NewRoundRobinBalancer(targets)

	pcfg := middleware.ProxyConfig{
		Balancer: balancer,
		Skipper:  middleware.DefaultSkipper,
		Rewrite: map[string]string{
			"/sc/*": "/$1",
		},
	}
	if scUrl.Scheme == "https" {
		tr := &http.Transport{
			TLSClientConfig:util.GetTLSConfig(),
		}
		pcfg.Transport = tr
	}

	g.Use(middleware.ProxyWithConfig(pcfg))
}

