em++ -std=c++17 -I../Empirical/source/ -Os --js-library ../Empirical/source/web/library_emp.js -s EXPORTED_FUNCTIONS="['_main', '_empCppCallback']" -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" -s NO_EXIT_RUNTIME=1 main.cc -o main.js
