import { Card, CardContent, Typography, Box } from '@mui/material';

/**
 * KPI summary card — shows a muted label above a bold hero number.
 *
 * @param {Object}      props
 * @param {string}      props.label     - Muted top label
 * @param {string|number} props.value   - Bold hero value
 * @param {React.ReactNode} props.icon  - MUI icon element shown in the top-right
 * @param {string}      [props.color]   - Accent color for the icon bg (default: primary.main)
 * @param {string}      [props.trend]   - Optional trend text (e.g. "+12%")
 * @param {'up'|'down'} [props.trendDir]- Direction of trend arrow coloring
 */
const KpiCard = ({ label, value, icon, color = 'primary.main', trend, trendDir }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.75,
                  display: 'inline-block',
                  fontWeight: 600,
                  color: trendDir === 'up' ? 'success.main' : trendDir === 'down' ? 'error.main' : 'text.secondary',
                }}
              >
                {trend}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: color,
              color: '#fff',
              flexShrink: 0,
              opacity: 0.9,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
