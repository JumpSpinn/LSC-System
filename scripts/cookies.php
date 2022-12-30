<?php
class Cookie
{
    public bool $isCookie = false;

    /**
     * Create a new Cookie
     *
     * @param string $name Cookie-Name
     * @param string $value Cookie-Value
     * @param int $expired Timestamp in Seconds
     * @param string $path Path
     * @param string $domain Domain
     * @param bool $secure is Secure
     * @param bool $httpOnly is HTTP or HTTPS
     * @return bool
     */
    public function set(string $name, string $value = "", int $expired = 0, string $path = "", string $domain = "", bool $secure = false, bool $httpOnly = false) :bool
    {
        $this->isCookie = setcookie($name, $value, $expired, $path, $domain, $secure, $httpOnly);

        return $this->isCookie;
    }

    public function get(string $name) :?string
    {
        return $_COOKIE[$name] || null;
    }

    public function delete(string|bool $name) :bool
    {
        $expiredTime = (time() - 3600);

        if(is_bool($name)) {
            if(isset($_SERVER['HTTP_COOKIE'])) {
                $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
                foreach($cookies as $cookie) {
                    $parts = explode('=', $cookie);
                    $name = trim($parts[0]);
                    $this->set($name, "", $expiredTime);
                }

                return true;
            }

            return false;
        }

        return $this->set($name, "", $expiredTime);
    }
}