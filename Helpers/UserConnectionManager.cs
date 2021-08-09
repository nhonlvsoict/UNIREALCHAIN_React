using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UNIREALCHAIN_React.Helpers
{
    public class UserConnectionManager : IUserConnectionManager
    {
        private static Dictionary<string, List<string>> _userConnectionMap = new Dictionary<string, List<string>>();
        private static string _userConnectionMapLocker = string.Empty;

        public void KeepUserConnection(string symbol, string connectionId)
        {
            lock (_userConnectionMapLocker)
            {
                if (!_userConnectionMap.ContainsKey(symbol))
                {
                    _userConnectionMap[symbol] = new List<string>();
                }
                _userConnectionMap[symbol].Add(connectionId);
            }
        }

        public void RemoveUserConnection(string connectionId, out string unmonitorSymbol)
        {
            unmonitorSymbol = "";
            //Remove the connectionId of user 
            lock (_userConnectionMapLocker)
            {
                foreach (var symbol in _userConnectionMap.Keys)
                {
                    if (_userConnectionMap.ContainsKey(symbol))
                    {
                        if (_userConnectionMap[symbol].Contains(connectionId))
                        {
                            _userConnectionMap[symbol].Remove(connectionId);
                            if(_userConnectionMap[symbol].Count == 0)
                            {
                                _userConnectionMap.Remove(symbol);
                                unmonitorSymbol = symbol;
                            }
                            break;
                        }
                    }
                }
            }
        }
        public List<string> GetUserConnections(string symbol)
        {
            var conn = new List<string>();
            lock (_userConnectionMapLocker)
            {
                conn = _userConnectionMap[symbol];
            }
            return conn;
        }
    }
}
