package com.rubine.backend.authenticationTests;

import com.rubine.authentication.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class JwtTokenProviderTest {
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    public void setUp() throws Exception {
        String privateKey = "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClGK++VZEiKj8a4RM2wVAiIOMmr7H1CNx5NB6s70lJ/T6y9wAMWdMOXRpz4vVGx2zEKnDsnMl9C3NM63blo6VcQIUHJsHBDs4ctkSsNBbXFox7GYuOuX1dJamIDqSMtJxcyTFPW9iWoK/XaBzwJE5nOeP8dQZY25uDbqSa+Uf6+8khZimOC3HmV7cEOh4VS688otKz3QvKerwxOGNn+ecbCD44yQY0mFdmJRxQbHPaxOKfwhx53JTxM8u15I3oqHZibKI349dCR3TxJLLqcORRpPbmhYmgaCMRJcP0f2VqaJD79gDQSguydciHbhly1x18jsvUc571LLe3TSFpfKzVAgMBAAECggEAEzXHJTom9Axptq1KeLbk+xj2irGA3xvT2OqJSI1jQA+5NEZspANDp/U0txfz0EjeIrPe2zlMceyw0toccJCqagyRLgmCxqhRWqKUD7F+mDJl0DZjDbgO7+q09Ow3QK63TviTcJd69ok7TLDZmnuu/8XgUvzO60H1BhsMCNhJWYOzWCl81d232EtReKUrpMifto8FpKEafj56nvvPmdhb1Jg1Aq+NdTeX54ixAqse7vl+A+JZnadXkgUhN0ojurv3MlmGxzBHo6vsDKyqwi0pbCJctlke6I60s3ykNtkSkk58TR58YyiUNHJjVlPyfeWhm9bAP8S1wumcGPBgwHDxdQKBgQDbCLxcUJdjku7LNLPNajKlIBSPMIcd1lVIcaJxSSpEkM3I7d/Rkc5HGSlk10L8s4ty7KE5N/UJNISNWUym53oYiu7RGnSPL84ECYWM/d4k5wD/ZC7xN/oN1sonApbYfsqPqEoe250FsyVKIx208an1BfqbSFB/IjbB3z2TrK29JwKBgQDA9Zk9fTJsacvOaj4HA/ZG6dPwVhF8U77rjvAyuOFTklzH5EQZc4UVLOcypM+Te9p0HlGu1LMwsSVwR1TCksQEOCxv1hVideGTcLkphX22V64h/GhNCoAlg7iUq4ulWONrovYxBA1tOg3/RMUxC7U53uTNK+b1cq2o29xVv1j7owKBgEumQcA0iYT3m4gNhMg+lI1ZfiBSZ2hTvZLOxIcR+QpDZP+vwKzWCgOeWiCdBGLY9CHWPnzPqc7rF5jmLcY7jnzph0ArPfSyUxor27dtewsNyddrV5cyeSfMdndwun69k+J4AlmUCjCMxiVL6Ze0G7onvX1iRYMTYwwkuVTGwB7jAoGAUI+5tQRqYv0gzENrNj6fOigyBmvIzSGh2nNJMcQiv2OiPQq+q+mhLKAcvvY0fBz/re9ipx3C2pd7TA9cAgiIskJJuz+kmgEhdw9fH0jOnayp1SKu4Ut7CS6fh+K/YP9lo/Db3McWW/4bDfLGaZ27wjefS1IDEYMZoiB5M4u6OQUCgYA8kwNap/sn165JBs5RW1oZQ8+mvKWs8B6cUGlmxqq+QryT+R9E3ECsKSmiDH2ozeT6iNapmzGncFT0xjcNgOhpyMd6g32GNA2L470S7tRxxw0zFoIvsNWNSHsRmsTH7UTvAIyxvaZkICFu5XICsQ4rzVlTt0Ds8b+2aLFpY0Yk3A==";
        String publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApRivvlWRIio/GuETNsFQIiDjJq+x9QjceTQerO9JSf0+svcADFnTDl0ac+L1RsdsxCpw7JzJfQtzTOt25aOlXECFBybBwQ7OHLZErDQW1xaMexmLjrl9XSWpiA6kjLScXMkxT1vYlqCv12gc8CROZznj/HUGWNubg26kmvlH+vvJIWYpjgtx5le3BDoeFUuvPKLSs90Lynq8MThjZ/nnGwg+OMkGNJhXZiUcUGxz2sTin8IcedyU8TPLteSN6Kh2YmyiN+PXQkd08SSy6nDkUaT25oWJoGgjESXD9H9lamiQ+/YA0EoLsnXIh24ZctcdfI7L1HOe9Sy3t00haXys1QIDAQAB";
        jwtTokenProvider = new JwtTokenProvider(privateKey, publicKey);
    }

    @Test
    public void testGenerateAndValidateToken() {
        UserDetails userDetails = new User("test@example.com", "password", new ArrayList<>());
        String token = jwtTokenProvider.generateToken(userDetails);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
    }

    @Test
    public void testGetEmailFromToken() {
        UserDetails userDetails = new User("test@example.com", "password", new ArrayList<>());
        String token = jwtTokenProvider.generateToken(userDetails);

        String email = jwtTokenProvider.getEmailFromToken(token);
        assertEquals("test@example.com", email);
    }

}
