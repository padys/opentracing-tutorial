# OPENTRACING-TUTORIAL

Simple application to fiddle with [opentracing](https://opentracing.io/) idea. Start the same application on different ports to create clients and APIs. Call client endpoint and trace the chain of API requests.

## What do you need?

Preferably the linux OS machine with:

1. [docker](https://www.docker.com/)
2. [nodejs/npm](https://www.npmjs.com/get-npm)
3. [git](https://git-scm.com/downloads)
4. [curl](https://curl.se/) (or other "web browser")

## How to start?

1. Download this project:
    ```
    $ git clone https://github.com/padys/opentracing-tutorial.git
    ```
2. Install required libs:
    ```
    $ cd opentracing-tutorial
    $ npm install
    ```
3. Run Jaeger all-in-one package using docker:
    ```
    $ docker run -d --name jaeger \​
      -p 5775:5775/udp \​
      -p 6831:6831/udp \​
      -p 6832:6832/udp \​
      -p 5778:5778 \​
      -p 16686:16686 \​
      -p 14268:14268 \​
      -p 14250:14250 \​
      -p 9411:9411 \​
      jaegertracing/all-in-one:latest​
    ```

## How to play?

1. Run project in three separate terminals.

    first terminal:
    ```
    $ cd opentracing-tutorial
    $ npm run start0
    ```
    second terminal:
    ```
    $ cd opentracing-tutorial
    $ npm run start1
    ```
    third terminal:
    ```
    $ cd opentracing-tutorial
    $ npm run start2
    ```

    It launches HTTP servers respectly on ports 8080, 8081 and 8082. Check earlier if that ports are not already used!

2. Open [http://127.0.0.1:8080/success_success_success](http://127.0.0.1:8080/success_success_success) using `curl` or any web browser:

    ```
    $ curl -H "jaeger-debug-id: some-correlation-id" http://127.0.0.1:8080/success_success_success
    ```

    TIP: You should see some logs in yours three terminals...

3. Open Jaeger-UI client app in web browser ([http://localhost:16686/search​](http://localhost:16686/search​)), to see the chain of requests.

4. Feel free to call other endpoints and modify the code!

    For example, try comment lines `tracer.inject(...)` or launch [http://127.0.0.1:8080/success_error](http://127.0.0.1:8080/success_error). Do you see difference in Jaeger-UI diagrams? Look at sent headers, baggages in console logs...

## Useful links:

* https://github.com/jaegertracing/jaeger-client-node
* https://opentracing.io/
* https://www.jaegertracing.io/
* https://github.com/opentracing/specification/blob/master/specification.md
* https://github.com/yurishkuro/opentracing-tutorial
