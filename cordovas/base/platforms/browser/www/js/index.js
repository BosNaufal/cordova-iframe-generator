/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    // http://stackoverflow.com/questions/935127/how-to-access-parent-iframe-from-javascript

    // Hijack Back Button
    var iframe = document.body.getElementsByTagName('iframe')[0]
    function onBackKeyDown(e) {
      e.preventDefault()
      console.log(iframe.contentWindow.history);
      console.log(iframe.contentWindow.cordova);
      console.log(window.FileTransfer);
      console.log(iframe.contentWindow);
      console.log(window);
      iframe.contentWindow.history.back()
    }
    document.addEventListener("backbutton", onBackKeyDown, false);

    // Attach downloadFile Function to the app function
    app.downloadFile = function(url) {

      var fileTransfer = new FileTransfer();
      var fileURL = 'cdvfile://localhost/persistent/download/'
      var uri = encodeURI(url);

      fileTransfer.download(
          uri,
          fileURL,
          function(entry) {
              console.log("download complete: " + entry.toURL());
          },
          function(error) {
              console.log("download error source " + error.source);
              console.log("download error target " + error.target);
              console.log("download error code" + error.code);
          },
          false, {}
      );

    }

    iframe.style.display = "block";

    // iframe.contentWindow.FileTransfer = FileTransfer;
    iframe.contentWindow.getCordova = function (name) {
      return window[name]
    };
    iframe.contentWindow.getDevice = function () {
      return navigator
    };
  },

};

app.initialize();
