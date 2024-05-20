// This file generates the spelling list from https://github.com/HoldOffHunger/convert-british-to-american-spellings
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BSD 3-Clause License

// Copyright (c) 2019, HoldOffHunger
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// Modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this
//    List of conditions and the following disclaimer.

// 2. Redistributions in binary form must reproduce the above copyright notice,
//    This list of conditions and the following disclaimer in the documentation
//    And/or other materials provided with the distribution.

// 3. Neither the name of the copyright holder nor the names of its
//    Contributors may be used to endorse or promote products derived from
//    This software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { writeFile } from 'fs/promises';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

async function getWords(url) {
    const response = await fetch(url),
        text = await response.text(),
        lines = text.split('\n'),

        words = {},
        startLine = lines.findIndex(line => line.trim().startsWith('public function AmericanBritishWords() {')) + 2;

    for (let i = startLine; i < lines.length; i++) {
        if (lines[i].trim() === '];') {break;}
        let [american, british] = eval(`[${lines[i].trim().replace('=>', ',')}]`);
        american = american.toLowerCase().trim();
        if (typeof british === 'string') {british = [british];}
        british = british
            .map(word => word.toLowerCase().trim())
            .filter(word => word.length > 0 && word !== american);
        words[american] ||= [];
        words[american].push(...british);
    }

    return words;
}

const words = {};
for (const letter of alphabet) {
    const url = `https://raw.githubusercontent.com/HoldOffHunger/convert-british-to-american-spellings/master/lib/Words/AmericanBritish/AmericanBritishWords_${letter}.php`;
    Object.assign(words, await getWords(url)); // Merge the words
}

writeFile('words.json', JSON.stringify(words, null, 4));