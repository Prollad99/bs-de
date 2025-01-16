<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html>
      <head>
        <title>Post Tag Sitemap</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            padding: 20px;
            background-color: #f9f9f9;
          }
          h1 {
            font-size: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: #fff;
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px 12px;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f4f4f4;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h1>Post Tag Sitemap</h1>
        <table>
          <thead>
            <tr>
              <th>Tag URL</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc" />
                  </a>
                </td>
                <td>
                  <xsl:value-of select="sitemap:lastmod" />
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>