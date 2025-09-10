'use client';

export default function StatisticsStrip({ stats }) {
  return (
    <div className="statistics-strip">
      <div className="statistics-row">
        {/* Leads Section */}
        <div className="stat-section">
          <div className="stat-section-title">Leads</div>
          <div className="stat-items-row">
            <div className="stat-item">
              <div className="stat-label">New</div>
              <div className="stat-value">{stats.newLeads || 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Contacted</div>
              <div className="stat-value">{stats.contactedLeads || 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Qualified</div>
              <div className="stat-value">{stats.qualifiedLeads || 0}</div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="stat-divider"></div>

        {/* Opportunities Section */}
        <div className="stat-section">
          <div className="stat-section-title">Opportunities</div>
          <div className="stat-items-row">
            <div className="stat-item">
              <div className="stat-label">Discovery</div>
              <div className="stat-value">{stats.discoveryOpps || 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Proposal</div>
              <div className="stat-value">{stats.proposalOpps || 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Won</div>
              <div className="stat-value">{stats.wonOpps || 0}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Lost</div>
              <div className="stat-value">{stats.lostOpps || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
