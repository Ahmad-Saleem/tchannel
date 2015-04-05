// Copyright (c) 2015 Uber Technologies, Inc.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

var test = require('tape');
var bufrw = require('bufrw');
var testRW = require('bufrw/test_rw');
var Checksum = require('../../v2/checksum.js');
var ArgsRW = require('../../v2/args.js');

function TestBody(csum, args) {
    if (!(this instanceof TestBody)) {
        return new TestBody(csum, args);
    }
    var self = this;
    self.csum = Checksum.objOrType(csum);
    self.args = args || [];
}

TestBody.RW = bufrw.Struct(TestBody, [
    {call: ArgsRW(bufrw.buf2)}
]);

test('ArgsRW: read/write payload', testRW.cases(TestBody.RW, [

    [
        TestBody(null, []), [
            0x00 // csumtype:1
        ]
    ],

    [
        TestBody(null, [Buffer('on')]), [
            0x00,                  // csumtype:1
            0x00, 0x02, 0x6f, 0x6e // arg1~2
        ]
    ],

    [
        TestBody(null, [Buffer('on'), Buffer('to')]), [
            0x00,                   // csumtype:1
            0x00, 0x02, 0x6f, 0x6e, // arg1~2
            0x00, 0x02, 0x74, 0x6f  // arg2~2
        ]
    ],

    [
        TestBody(null, [Buffer('on'), Buffer('to'), Buffer('te')]), [
            0x00,                   // csumtype:1
            0x00, 0x02, 0x6f, 0x6e, // arg1~2
            0x00, 0x02, 0x74, 0x6f, // arg2~2
            0x00, 0x02, 0x74, 0x65  // arg3~2
        ]
    ]

]));
