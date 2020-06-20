#!/usr/bin/env node

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// We need crypto, so import it here
const crypto = require("crypto");

// Setup arrays holding the characters we will use
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const letters = [...alphabet, ...alphabet.toUpperCase()];
const numbers = [..."1234567890"];
const symbols = [..."`~!@#$%^&*()-_=+[{]}|;:,<.>/?"];

// Really simple function to generate random numbers up to a maximum
const rand = (max) => Math.floor(Math.random() * max);

// Function that returns if a value was in the arguments
const arg = (value) => process.argv.includes(value);

// Function that returns a function selecting an item from an array.
const getrand = (array) => () => array[rand(array.length)];

// Functions for getting random items from our character arrays.
const any = getrand([
    ...letters,
    ...(arg("-nonumbers") ? [] : numbers),
    ...(arg("-nosymbols") ? [] : symbols)
]);

// Function for generating UUIDs - not totally perfect, but good enough.
// SO: https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.randomBytes(1)[0] & (15 >> (c / 4)))
    ).toString(16)
  );

// Generate a UUID to base this all on.
const base = uuid();

// Strip out symbols and encode to base64
let enc = Buffer.from(base.replace("-", "")).toString('base64');

// If there aren't meant to be numbers in there, pull them out of the base.
if (arg("-nonumbers")) {
    enc = enc.replace(/\d/g, any());
}

// The only symbol that could be present is an '=', so pull that out if it is
// there.
if (arg("-nosymbols")) {
    enc = enc.replace("=", any())
}

// Decide how many characters we are going to randomize.
const runs = rand(Math.pow(enc.length, 2)) + enc.length;

// Randomize!
for (let i = 0; i < runs; i++) {
  enc = enc.replace(any(), any());
}

// If the verbose option has been provided, give a little extra detail as to
// how the password was generated.
if (arg("-v") || arg("-verbose")) {
    console.table({
        "Original": base,
        "Runs": runs,
        "Includes Numbers?": !arg("-nonumbers"),
        "Includes Symbols?": !arg("-nosymbols"),
        "Result": enc,
    });

    return;
}

// Log the final password to the output so users can copy it.
console.log(enc);