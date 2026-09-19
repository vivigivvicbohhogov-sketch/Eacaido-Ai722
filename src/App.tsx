/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { CodeEntry } from './pages/CodeEntry';
import { VideoCreation } from './pages/VideoCreation';
import { Support } from './pages/Support';
import { AdminPortal } from './pages/AdminPortal';
import { StudioViewer } from './pages/StudioViewer';
import { GoogleAuthBridge } from './pages/GoogleAuthBridge';

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/CodeEntry" replace />} />
          <Route path="/CodeEntry" element={<CodeEntry />} />
          <Route path="/VideoCreation" element={<VideoCreation />} />
          <Route path="/GoogleAuthBridge" element={<GoogleAuthBridge />} />
          <Route path="/StudioViewer" element={<StudioViewer />} />
          <Route path="/Support" element={<Support />} />
          <Route path="/AdminPortal" element={<AdminPortal />} />
          <Route path="*" element={<Navigate to="/CodeEntry" replace />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
}

