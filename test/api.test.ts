import { it, expect, describe, beforeAll, afterAll, jest } from '@jest/globals'
import { AddressInfo } from 'net';

describe('API Users E2E Suite', () => {
    function waitForServerStatus(server: any) {
        return new Promise((resolve, reject) => {
            server.once('error', (err: any) => reject(err))
            server.once('listening', () => resolve(true))
            server.once('mount', () => resolve(server))
        });
    }

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('E2E Tests for Server in a non-test environment', () => {
        it('should start server with PORT 4000', async () => {
            const PORT = 4000;
            const HOST = '0.0.0.0'
            process.env.NODE_ENV = 'production';
            process.env.SERVER_PORT = String(PORT);
            process.env.SERVER_HOST = HOST;


            jest
                .spyOn(
                    console,
                    console.log.name as 'log'
                )

            const { server } = await import('../src/index');

            await waitForServerStatus(server);

            const serverInfo = server.address() as AddressInfo;
            expect(serverInfo.port).toBe(PORT);
            expect(console.log).toHaveBeenCalledWith(`Servidor iniciado em ${HOST}:${PORT}`);

            return new Promise(resolve => server.close(resolve))
        }, 10000);
    });
    
    describe('E2E Tests for Server', () => {
        let _testServer: any;
        let _testServerAdress: string;

        function login(data: any) {
            return fetch(`${_testServerAdress}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
        }

        beforeAll(async () => {
            process.env.NODE_ENV = 'test'

            jest.useFakeTimers({
                now: new Date('2023-11-23T00:00')
            })

            const { default: app } = await import('../src/index')
            _testServer = app.listen()

            await waitForServerStatus(_testServer)

            const serverInfo = _testServer.address()
            _testServerAdress = `http://0.0.0.0:${serverInfo.port}`
            console.log(`Servidor iniciado em ${_testServerAdress}`)
        })

        afterAll(done => {
            jest.useRealTimers()
            _testServer.close(() => {
                done();
            });
        })

        it.skip('should return 404 for unsupported routes', async () => {
            // Need to threat unsupported routes. 
            const response = await fetch(`${_testServerAdress}/unsupported`, {
                method: 'POST'
            })
            expect(response.status).toBe(404)
        }, 10_000)

        it('should return 400 for wrong user and password validation', async () => {
            const response = await login({ user: `teste`, password: `teste` })
            expect(response.status).toBe(400)
        }, 10_000)
    })
})

