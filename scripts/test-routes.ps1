$routes = @(
    '/',
    '/campaigns',
    '/campaigns/kalimantan-clean-water',
    '/submit/kalimantan-clean-water',
    '/review',
    '/audit',
    '/docs',
    '/docs/architecture',
    '/docs/contracts',
    '/docs/verification-agent',
    '/docs/audit',
    '/docs/setup',
    '/how-it-works'
)

foreach ($route in $routes) {
    try {
        $url = "http://localhost:3001" + $route
        $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 40
        Write-Host "✅ $route -> HTTP $($res.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ $route -> ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}
