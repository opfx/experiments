import { SpecPage } from '@stencil/core/testing';
import { newSpecPage } from '@stencil/core/testing';

import { Icon } from './../icon';

describe('button', () => {
  const renderPage = async (html: string, supportsShadowDom = false): Promise<SpecPage> => {
    return await newSpecPage({ html, components: [Icon], supportsShadowDom });
  };

  it(`should have shadow dom enabled`, async () => {
    const { root } = await renderPage('<wx-icon></wx-icon>', true);
    expect(root.shadowRoot).toBeTruthy();
  });

  it(`should render`, async () => {
    const { root } = await renderPage('<wx-icon></wx-icon>');
    expect(root).toEqualHtml(`
    <wx-icon class='md' role='img'>
        <div class="icon-inner"></div>
    </wx-icon>
    `);
  });

  it(`should render aria-hidden and no aria-label`, async () => {
    const { root } = await renderPage('<wx-icon aria-hidden="true"></wx-icon>');
    expect(root).toEqualHtml(`
      <wx-icon class="md" role="img" aria-hidden="true">
      <div class="icon-inner"></div>
      </wx-icon>
      `);
  });
});
