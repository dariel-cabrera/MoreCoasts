const CircuitBreaker = require('opossum');

export function createBreaker<T>(action: () => Promise<T>) {
  const breaker = new CircuitBreaker(action, {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000,
  });

  breaker.fallback(() => ({
    message: 'Servicio no disponible temporalmente. Por favor, intenta más tarde.',
  }));

  breaker.on('open', () => console.warn('🔴 Circuito abierto: fallback activado.'));
  breaker.on('halfOpen', () => console.log('🟡 Circuito medio abierto.'));
  breaker.on('close', () => console.log('🟢 Circuito cerrado: servicio restaurado.'));

  return breaker;
}
