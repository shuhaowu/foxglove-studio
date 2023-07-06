// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { isEqual } from "lodash";
import { useRef } from "react";

// Continues to return the same instance as long as deep equality is maintained.
export default function useDeepMemo<T extends object | undefined>(value: T): T {
  const ref = useRef(value);
  const deepEqualCopiesRef = useRef<WeakSet<object>>();

  if (value == undefined) {
    return value;
  }

  if (!deepEqualCopiesRef.current) {
    deepEqualCopiesRef.current = new WeakSet();
  }

  // If A is passed to useDeepMemo first and get memoized, then B (which is
  // equal to A in value but different in reference) is passed to useDeepMemo
  // every time it is called henceforth, we need to ensure we don't run isEqual
  // for every subsequent call. This is what the WeakSet allows us to do.
  if (deepEqualCopiesRef.current.has(value)) {
    return ref.current;
  }

  if (isEqual(value, ref.current)) {
    deepEqualCopiesRef.current.add(value);
    return ref.current;
  }

  // New value detected, so we need to remove all the deepEqualCopies weak set
  // so we don't return the wrong value.
  deepEqualCopiesRef.current = new WeakSet();
  deepEqualCopiesRef.current.add(value);
  ref.current = value;
  return value;
}
